# Workspace Rules & Branching Strategy

## Feature-Based Branching Rules
When making changes or adding features to this repository, commits MUST be pushed to their designated feature branch on GitHub before merging into `main`:

1. **Client Portal / Client Page (`public/client-page`, `app/(client)`):**
   - Branch: `feature/client-page`
   - Command: `git checkout feature/client-page` -> work & commit -> `git push origin feature/client-page` -> merge to `main`.

2. **Admin Dashboard / Admin Features (`app/admin`, `components/admin`):**
   - Branch: `feature/admin-page`
   - Command: `git checkout feature/admin-page` -> work & commit -> `git push origin feature/admin-page` -> merge to `main`.

3. **Agents & Bots (`packages/agents`, AI logic, WhatsApp bots):**
   - Branch: `feature/agents-and-bots`
   - Command: `git checkout feature/agents-and-bots` -> work & commit -> `git push origin feature/agents-and-bots` -> merge to `main`.

4. **Workflows & Automation (`workflows/`, `.github/workflows`):**
   - Branch: `feature/workflow`
   - Command: `git checkout feature/workflow` -> work & commit -> `git push origin feature/workflow` -> merge to `main`.

5. **Deployment:**
   - Always verify pnpm workspace build (`pnpm --filter sierra-estates-realty build`) before pushing.
