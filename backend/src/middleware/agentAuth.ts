import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';

export interface AgentRequest extends Request {
  agentKey?: {
    id: string;
    name: string;
    keyPrefix: string;
    permissions: string[];
  };
}

/**
 * Middleware factory requiring a specific permission scope for AI Agent API endpoints.
 */
export const requireAgentPermission = (requiredPermission: string) => {
  return async (req: AgentRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized Agent API Request. Missing or invalid Authorization header.',
      });
    }

    const rawApiKey = authHeader.split(' ')[1].trim();
    if (!rawApiKey) {
      return res.status(401).json({ success: false, error: 'Unauthorized Agent API Request. Empty API key.' });
    }

    // Hash the presented raw key using SHA-256 to compare with DB
    const keyHash = crypto.createHash('sha256').update(rawApiKey).digest('hex');

    try {
      const apiKeyRecord = await prisma.agentApiKey.findUnique({
        where: { keyHash },
      });

      if (!apiKeyRecord || !apiKeyRecord.isActive || apiKeyRecord.revokedAt !== null) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden. Agent API Key is invalid, inactive, or revoked.',
        });
      }

      let permissions: string[] = [];
      try {
        permissions = JSON.parse(apiKeyRecord.permissions);
      } catch {
        permissions = [];
      }

      const hasPermission = permissions.includes(requiredPermission) || permissions.includes('admin:all');

      if (!hasPermission) {
        // Log denied attempt in audit log
        await prisma.agentAuditLog.create({
          data: {
            apiKeyId: apiKeyRecord.id,
            action: `${req.method.toLowerCase()}:${req.path}`,
            entityType: 'AgentPermissionCheck',
            payload: JSON.stringify({ requiredPermission, method: req.method, path: req.path }),
            status: 'DENIED',
            ipAddress,
          },
        });

        return res.status(403).json({
          success: false,
          error: `Forbidden. Agent API key lacks required permission: '${requiredPermission}'.`,
        });
      }

      // Update lastUsedAt asynchronously
      prisma.agentApiKey
        .update({
          where: { id: apiKeyRecord.id },
          data: { lastUsedAt: new Date() },
        })
        .catch(() => {});

      // Attach agent key data to request object
      req.agentKey = {
        id: apiKeyRecord.id,
        name: apiKeyRecord.name,
        keyPrefix: apiKeyRecord.keyPrefix,
        permissions,
      };

      // Helper function on response to easily record successful audit logs
      res.on('finish', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          prisma.agentAuditLog
            .create({
              data: {
                apiKeyId: apiKeyRecord.id,
                action: `${req.method.toLowerCase()}:${req.path}`,
                entityType: 'AgentAction',
                payload: JSON.stringify({
                  method: req.method,
                  path: req.path,
                  query: req.query,
                  bodyKeys: req.body ? Object.keys(req.body) : [],
                }),
                status: 'SUCCESS',
                ipAddress,
              },
            })
            .catch(() => {});
        }
      });

      next();
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'Internal server error validating Agent API key.' });
    }
  };
};
