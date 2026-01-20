import { MockUser } from '../common/mock-auth.service';

declare global {
  namespace Express {
    interface Request {
      user?: MockUser;
    }
  }
}
