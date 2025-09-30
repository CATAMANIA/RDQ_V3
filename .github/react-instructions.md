---
applyTo: '**/*.js, **/*.jsx, **/*.ts, **/*.tsx'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

# Code Structure & Organization :

- Component-Based Architecture Break your UI into reusable, focused components. Keep logic and presentation separate (e.g., container vs. presentational components).

- Consistent Folder Structure Group related files (e.g., Login.jsx, Login.test.js, Login.scss) together to improve maintainability.

- Naming Conventions Use PascalCase for components and camelCase for variables/functions to keep things predictable.

State & Props Management:

- Treat Props as Read-Only Never mutate props. They’re meant to be immutable inputs.

- Lift State Up When Needed Share state between components by lifting it to their nearest common ancestor.

- Avoid Overusing Context Use React Context sparingly—for global themes, auth, or language settings—not as a replacement for state management.

Performance Optimization :

- Use Stable Keys in Lists Avoid using array indices as keys. Use unique, stable identifiers instead.

- Memoization Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders.

- Avoid Mutating State Directly Always use immutable patterns like the spread operator or libraries like Immer.

Testing & Debugging :

- Write Unit and Integration Tests Use tools like React Testing Library and Jest to test components from the user’s perspective.

- Clean Up Side Effects Always clean up timers, subscriptions, or event listeners in useEffect to avoid memory leaks.

Styling & UI:

- CSS-in-JS or Modular CSS Use scoped styles to avoid global conflicts. Libraries like styled-components or CSS modules help here.

- Responsive Design Make sure your components adapt to different screen sizes using media queries or utility-first frameworks like Tailwind CSS.

Developer Experience:

- Use Functional Components with Hooks Prefer hooks over class components for cleaner and more modern code.

- Type Safety with TypeScript Catch bugs early and improve code readability with TypeScript integration.

- Organized Imports Group third-party and local imports separately for clarity

- For an easier maintenance, code must be as concise as possible.