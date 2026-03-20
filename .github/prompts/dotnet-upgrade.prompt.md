---
name: dotnet-upgrade
description: 'Comprehensive prompts for managing .NET framework upgrades'
---

# .NET Upgrade Prompts Reference

This resource provides a comprehensive collection of ready-to-use prompts organized across key categories for managing .NET framework upgrades.

## Project Discovery & Assessment

- Classify projects by type (web, library, console, test, etc.) and assess upgrade complexity
- Review dependency compatibility against target .NET version
- Detect legacy package configurations (packages.config, project.json) requiring modernization
- Identify deprecated APIs and third-party libraries with known incompatibilities
- Generate a dependency graph to visualize upgrade impact across the solution

## Upgrade Strategy & Sequencing

- Determine optimal project upgrade order (leaf projects first, shared libraries before consumers)
- Propose incremental upgrade strategies with rollback checkpoints at each stage
- Establish progress tracking mechanisms and milestones for multi-project solutions
- Identify parallel upgrade opportunities to reduce overall timeline
- Define success criteria and acceptance tests for each upgrade phase

## Framework Targeting & Code Adjustments

- Select appropriate target frameworks (.NET 8, .NET 9, or .NET Standard 2.0 for libraries)
- Identify and modernize deprecated patterns (e.g., `WebHostBuilder` → `HostBuilder`, `Startup` → minimal hosting)
- Convert synchronous operations to async alternatives where beneficial
- Update namespace imports affected by BCL reorganization
- Replace removed APIs with recommended alternatives from migration guides

## NuGet & Dependency Management

- Analyze package compatibility with target framework using NuGet compatibility matrix
- Strategize shared dependency handling across multi-targeting projects
- Resolve transitive dependency conflicts using binding redirects or version pinning
- Update to latest stable package versions while maintaining compatibility
- Remove deprecated packages and migrate to their successors

## CI/CD & Build Pipeline Updates

- Modernize YAML pipeline configurations to use updated .NET SDK versions
- Update `global.json` to specify required SDK versions
- Enhance automation validation with multi-stage build and test pipelines
- Configure matrix builds for multi-targeting scenarios
- Update Docker base images to .NET 8/9 variants

## Testing & Validation

- Establish build validation procedures after each incremental upgrade step
- Verify service integration with updated dependencies and runtime behavior
- Confirm deployment readiness with smoke tests and health checks
- Run full regression suite against upgraded solution
- Validate performance benchmarks to detect regressions

## Breaking Change Analysis

- Identify deprecated APIs using Roslyn analyzers and upgrade compatibility tooling
- Recommend replacement APIs with code examples from official migration documentation
- Focus regression testing on areas affected by known breaking changes
- Review behavioral changes in runtime, serialization, and networking layers
- Document required code changes with before/after examples

## Version Control & Commit Strategy

- Plan branching strategies for upgrade work (feature branch per project or per phase)
- Structure pull requests to enable incremental review (one project or layer per PR)
- Write clear commit messages documenting the specific change and its reason
- Tag stable checkpoints to enable rollback if critical issues are discovered
- Set up code review guidelines specific to upgrade changes

## Documentation & Communication

- Maintain an upgrade log tracking decisions, blockers, and resolutions
- Communicate breaking changes and migration steps to the development team
- Update README files and developer onboarding docs to reflect new requirements
- Document any deferred items and technical debt introduced during the upgrade
- Produce a post-upgrade summary for stakeholders

## Tools & Automation

- Evaluate the .NET Upgrade Assistant for automated migration tasks
- Generate scripts to automate repetitive changes (e.g., namespace updates, package replacements)
- Use `dotnet-outdated` and similar tools to identify stale dependencies
- Validate tool outputs across multiple repositories in a monorepo scenario
- Integrate static analysis tools to catch upgrade-related issues early

## Final Validation & Delivery

- Run end-to-end tests across all upgraded projects before merging to main
- Verify all CI/CD pipelines pass on the upgrade branch
- Confirm production deployment procedures work with the upgraded stack
- Archive migration artifacts and tooling scripts for future reference
- Conduct a retrospective to capture lessons learned for future upgrades
