// PortfolioViewModel.swift
// Global state shared across scenes via @Environment.
// Projects come from `Project.all` (declared in Scenes/ProjectsScene.swift).

import SwiftUI
import Observation

@Observable
final class PortfolioViewModel {

    var projects:     [Project]    = Project.all
    var skills:       [Skill]      = MockData.skills
    var experiences:  [Experience] = MockData.experiences
    var certificates: [Certificate] = MockData.certificates

    var selectedProjectID: Project.ID? = nil
    var isImmersiveSpaceOpen: Bool     = false
    var persona: Persona               = .recruiter

    func project(id: Project.ID) -> Project? {
        projects.first { $0.id == id }
    }

    func skills(in category: Skill.Category) -> [Skill] {
        skills.filter { $0.category == category }.sorted { $0.proficiency > $1.proficiency }
    }
}
