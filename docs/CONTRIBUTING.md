# Contributing Guidelines

## Development Workflow
1. **Branching**: Develop features in descriptive feature branches.
2. **Quality Gates**: Ensure `npx tsc --noEmit` and `npm run build` pass clean.
3. **Commit Conventions**: Follow conventional commit formats:
   - `feat(scope)`: New features
   - `fix(scope)`: Bug fixes
   - `docs(scope)`: Documentation updates
   - `test(scope)`: Verification & test suites
   - `refactor(scope)`: Code refactoring without behavioral change
