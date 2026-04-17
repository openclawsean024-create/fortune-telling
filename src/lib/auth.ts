import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// 簡化版会员系统 - 使用内存存储 + 浏览器 localStorage 模拟持久化
// 生产环境应使用完整 NextAuth + Prisma + PostgreSQL

// 演示账号：demo@fortune.com / fortune2026
const DEMO_USERS = [
  { id: '1', email: 'demo@fortune.com', password: 'fortune2026', name: '命理旅客' },
  { id: '2', email: 'test@test.com', password: 'test1234', name: '測試用戶' },
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = DEMO_USERS.find(
          u => u.email === credentials.email && u.password === credentials.password
        );
        if (!user) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (token?.sub && session?.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET || 'fallback-secret-for-dev',
});
