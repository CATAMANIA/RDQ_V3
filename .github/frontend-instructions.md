# Frontend Development Instructions - RDQ_V3

## Vue d'ensemble
Le frontend RDQ_V3 est développé en React 18+ avec TypeScript, utilisant Vite comme bundler. Il fournit une interface utilisateur moderne et responsive pour la gestion des Demandes de Ressources Qualifiées (RDQ).

## Architecture Frontend

### Structure des dossiers
```
frontend/
├── public/              # Assets statiques
├── src/
│   ├── components/      # Composants réutilisables
│   │   ├── ui/         # Composants UI de base (Radix UI)
│   │   ├── forms/      # Composants de formulaires
│   │   ├── layout/     # Composants de mise en page
│   │   └── common/     # Composants communs
│   ├── pages/          # Pages/Routes principales
│   │   ├── auth/       # Pages d'authentification
│   │   ├── dashboard/  # Tableaux de bord
│   │   ├── rdq/        # Pages gestion RDQ
│   │   └── admin/      # Pages administration
│   ├── hooks/          # Custom React hooks
│   ├── contexts/       # Contexts React (auth, theme, etc.)
│   ├── services/       # Services API et logique métier
│   ├── types/          # Types TypeScript
│   ├── utils/          # Fonctions utilitaires
│   ├── styles/         # Styles globaux
│   └── constants/      # Constantes et configuration
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## Standards de développement

### Conventions de nommage
- **Composants** : PascalCase (ex: `RdqList`, `UserProfile`)
- **Fichiers** : kebab-case (ex: `rdq-list.tsx`, `user-profile.tsx`)
- **Hooks** : camelCase avec préfixe "use" (ex: `useRdqData`, `useAuth`)
- **Services** : camelCase (ex: `rdqService`, `authService`)
- **Types** : PascalCase (ex: `RdqData`, `UserRole`)
- **Constants** : SCREAMING_SNAKE_CASE (ex: `API_BASE_URL`, `RDQ_STATUS`)

### Structure des composants

#### Composant fonctionnel type
```typescript
import React from 'react';
import { cn } from '@/utils/cn';

interface RdqCardProps {
  rdq: RdqData;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export const RdqCard: React.FC<RdqCardProps> = ({
  rdq,
  onEdit,
  onDelete,
  className
}) => {
  const handleEdit = () => {
    onEdit?.(rdq.id);
  };

  const handleDelete = () => {
    onDelete?.(rdq.id);
  };

  return (
    <div className={cn("rounded-lg border p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{rdq.title}</h3>
        <RdqStatusBadge status={rdq.status} />
      </div>
      
      <p className="mt-2 text-sm text-gray-600">{rdq.description}</p>
      
      <div className="mt-4 flex gap-2">
        {onEdit && (
          <Button variant="outline" size="sm" onClick={handleEdit}>
            Modifier
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Supprimer
          </Button>
        )}
      </div>
    </div>
  );
};
```

#### Règles pour les composants
- Props typées avec interface TypeScript
- Props optionnelles avec `?`
- Gestion des événements avec handlers explicites
- Utilisation de `cn()` pour combiner les classes CSS
- Export named (pas de default export)
- Documentation JSDoc pour composants complexes

### Gestion d'état

#### Context pour l'authentification
```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      localStorage.setItem('token', response.token);
    } catch (error) {
      throw new Error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const hasRole = (role: UserRole) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

#### Hook personnalisé pour données RDQ
```typescript
interface UseRdqDataProps {
  userId?: string;
  status?: RdqStatus;
  page?: number;
  size?: number;
}

export const useRdqData = ({
  userId,
  status,
  page = 0,
  size = 20
}: UseRdqDataProps = {}) => {
  const [data, setData] = useState<PagedResponse<RdqData> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await rdqService.getRdqList({
        userId,
        status,
        page,
        size
      });
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }, [userId, status, page, size]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return { data, isLoading, error, refetch };
};
```

### Services API

#### Service de base avec intercepteurs
```typescript
class ApiService {
  private baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
  
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expiré, rediriger vers login
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Session expirée');
      }
      
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Erreur ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();
```

#### Service RDQ spécialisé
```typescript
interface GetRdqListParams {
  userId?: string;
  status?: RdqStatus;
  page?: number;
  size?: number;
  search?: string;
}

class RdqService {
  async getRdqList(params: GetRdqListParams): Promise<PagedResponse<RdqData>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return apiService.get<PagedResponse<RdqData>>(
      `/rdq?${searchParams.toString()}`
    );
  }

  async getRdqById(id: string): Promise<RdqData> {
    return apiService.get<RdqData>(`/rdq/${id}`);
  }

  async createRdq(data: CreateRdqRequest): Promise<RdqData> {
    return apiService.post<RdqData>('/rdq', data);
  }

  async updateRdq(id: string, data: UpdateRdqRequest): Promise<RdqData> {
    return apiService.put<RdqData>(`/rdq/${id}`, data);
  }

  async deleteRdq(id: string): Promise<void> {
    return apiService.delete<void>(`/rdq/${id}`);
  }

  async approveRdq(id: string, comment: string): Promise<RdqData> {
    return apiService.post<RdqData>(`/rdq/${id}/approve`, { comment });
  }

  async rejectRdq(id: string, comment: string): Promise<RdqData> {
    return apiService.post<RdqData>(`/rdq/${id}/reject`, { comment });
  }
}

export const rdqService = new RdqService();
```

### Formulaires avec React Hook Form

#### Formulaire de création RDQ
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createRdqSchema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères'),
  description: z.string().min(20, 'La description doit contenir au moins 20 caractères'),
  type: z.enum(['FORMATION', 'MATERIEL', 'LOGICIEL', 'AUTRE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  requestedDate: z.date().min(new Date(), 'La date doit être future'),
  justification: z.string().optional()
});

type CreateRdqFormData = z.infer<typeof createRdqSchema>;

interface CreateRdqFormProps {
  onSubmit: (data: CreateRdqFormData) => Promise<void>;
  onCancel: () => void;
}

export const CreateRdqForm: React.FC<CreateRdqFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreateRdqFormData>({
    resolver: zodResolver(createRdqSchema)
  });

  const handleFormSubmit = async (data: CreateRdqFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      // Gestion d'erreur (toast, etc.)
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="title">Titre *</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Titre de la demande"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Description détaillée de la demande"
          rows={4}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type de demande *</Label>
          <Select {...register('type')}>
            <SelectContent>
              <SelectItem value="FORMATION">Formation</SelectItem>
              <SelectItem value="MATERIEL">Matériel</SelectItem>
              <SelectItem value="LOGICIEL">Logiciel</SelectItem>
              <SelectItem value="AUTRE">Autre</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="priority">Priorité *</Label>
          <Select {...register('priority')}>
            <SelectContent>
              <SelectItem value="LOW">Faible</SelectItem>
              <SelectItem value="MEDIUM">Moyenne</SelectItem>
              <SelectItem value="HIGH">Haute</SelectItem>
              <SelectItem value="URGENT">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Création...' : 'Créer la demande'}
        </Button>
      </div>
    </form>
  );
};
```

### Routing avec React Router

#### Configuration des routes
```typescript
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'dashboard',
        element: (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <DashboardHome />
          },
          {
            path: 'rdq',
            children: [
              {
                index: true,
                element: <RdqListPage />
              },
              {
                path: 'new',
                element: <CreateRdqPage />
              },
              {
                path: ':id',
                element: <RdqDetailPage />
              },
              {
                path: ':id/edit',
                element: <EditRdqPage />
              }
            ]
          },
          {
            path: 'admin',
            element: (
              <RoleGuard allowedRoles={['ADMIN']}>
                <AdminLayout />
              </RoleGuard>
            ),
            children: [
              {
                index: true,
                element: <AdminDashboard />
              },
              {
                path: 'users',
                element: <UserManagement />
              },
              {
                path: 'settings',
                element: <SystemSettings />
              }
            ]
          }
        ]
      }
    ]
  }
]);

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};
```

#### Composants de protection
```typescript
interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
```

### Styling avec Tailwind CSS

#### Configuration Tailwind
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
```

#### Utilitaire pour classes conditionnelles
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Types TypeScript

#### Types métier
```typescript
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'USER' | 'MANAGER' | 'ADMIN';

export interface RdqData {
  id: string;
  title: string;
  description: string;
  type: RdqType;
  status: RdqStatus;
  priority: RdqPriority;
  userId: string;
  user: User;
  requestedDate: string;
  justification?: string;
  managerComment?: string;
  createdAt: string;
  updatedAt: string;
  attachments: RdqAttachment[];
  history: RdqHistoryEntry[];
}

export type RdqType = 'FORMATION' | 'MATERIEL' | 'LOGICIEL' | 'AUTRE';
export type RdqStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'PENDING_INFO';
export type RdqPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
```

#### Types de requêtes API
```typescript
export interface CreateRdqRequest {
  title: string;
  description: string;
  type: RdqType;
  priority: RdqPriority;
  requestedDate: string;
  justification?: string;
}

export interface UpdateRdqRequest extends Partial<CreateRdqRequest> {
  status?: RdqStatus;
  managerComment?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}
```

## Gestion des erreurs

### Hook pour les notifications toast
```typescript
import { toast } from 'sonner';

export const useErrorHandler = () => {
  const handleError = (error: unknown, defaultMessage = 'Une erreur est survenue') => {
    console.error('Error:', error);
    
    if (error instanceof Error) {
      toast.error(error.message);
    } else if (typeof error === 'string') {
      toast.error(error);
    } else {
      toast.error(defaultMessage);
    }
  };

  const handleSuccess = (message: string) => {
    toast.success(message);
  };

  return { handleError, handleSuccess };
};
```

### Boundary d'erreur React
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">
              Une erreur inattendue s'est produite
            </h2>
            <p className="mt-2 text-gray-600">
              Veuillez rafraîchir la page ou contacter le support.
            </p>
            <Button
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Rafraîchir la page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Performance et optimisation

### Lazy loading des composants
```typescript
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('@/pages/admin/UserManagement'));

export const AdminRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
      </Routes>
    </Suspense>
  );
};
```

### Memoization des composants
```typescript
import { memo } from 'react';

interface RdqCardProps {
  rdq: RdqData;
  onEdit?: (id: string) => void;
}

export const RdqCard = memo<RdqCardProps>(({ rdq, onEdit }) => {
  // Composant ne se re-rend que si rdq ou onEdit changent
  return (
    <div className="rounded-lg border p-4">
      {/* Contenu du composant */}
    </div>
  );
});

RdqCard.displayName = 'RdqCard';
```

## Tests

### Tests de composants avec Vitest et Testing Library
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { CreateRdqForm } from './CreateRdqForm';

describe('CreateRdqForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form fields correctly', () => {
    render(
      <CreateRdqForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    expect(screen.getByLabelText(/titre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
  });

  it('should call onSubmit with form data when valid', async () => {
    render(
      <CreateRdqForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    fireEvent.change(screen.getByLabelText(/titre/i), {
      target: { value: 'Test RDQ Title' }
    });

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test description with enough characters' }
    });

    fireEvent.click(screen.getByRole('button', { name: /créer/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test RDQ Title',
          description: 'Test description with enough characters'
        })
      );
    });
  });
});
```

### Tests de hooks personnalisés
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useRdqData } from './useRdqData';

// Mock du service
vi.mock('@/services/rdqService', () => ({
  rdqService: {
    getRdqList: vi.fn()
  }
}));

describe('useRdqData', () => {
  it('should fetch RDQ data on mount', async () => {
    const mockData = {
      content: [{ id: '1', title: 'Test RDQ' }],
      totalElements: 1
    };

    vi.mocked(rdqService.getRdqList).mockResolvedValue(mockData);

    const { result } = renderHook(() => useRdqData());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockData);
    });
  });
});
```

## Configuration environnement

### Variables d'environnement
```env
# .env.local
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=RDQ Management
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEBUG=true
```

```env
# .env.production
VITE_API_BASE_URL=https://api.rdq.company.com/api
VITE_APP_NAME=RDQ Management
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEBUG=false
```

### Configuration Vite
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select']
        }
      }
    }
  }
});
```

## Bonnes pratiques

### Accessibilité
- Utiliser les attributs ARIA appropriés
- Labels sur tous les éléments de formulaire
- Navigation au clavier fonctionnelle
- Contraste suffisant pour les textes
- Images avec attributs alt descriptifs

### Performance
- Lazy loading des routes et composants
- Memoization des calculs coûteux
- Optimisation des images (formats modernes)
- Bundle splitting et tree shaking
- Éviter les re-renders inutiles

### Sécurité
- Validation côté client ET serveur
- Échapper les contenus dynamiques
- HTTPS en production
- CSP (Content Security Policy)
- Gestion sécurisée des tokens

### Maintenance
- Tests automatisés complets
- Documentation des composants
- Conventions de nommage cohérentes
- Structure de dossiers logique
- Code review systématique

---

## Checklist développement

Avant chaque commit, vérifier :
- [ ] TypeScript compile sans erreur
- [ ] Tests unitaires passent
- [ ] Linting ESLint OK
- [ ] Pas de console.log en production
- [ ] Composants documentés
- [ ] Accessibilité vérifiée
- [ ] Performance optimisée
- [ ] Responsive design testé

---
*Dernière mise à jour : Octobre 2025*