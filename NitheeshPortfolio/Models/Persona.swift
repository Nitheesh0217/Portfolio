// Persona.swift
import SwiftUI

enum Persona: String, CaseIterable, Identifiable {
    case recruiter, developer, client

    var id: String { rawValue }

    var label: String {
        switch self {
        case .recruiter: "Recruiter"
        case .developer: "Developer"
        case .client:    "Client"
        }
    }

    var symbol: String {
        switch self {
        case .recruiter: "person.crop.rectangle.badge.plus"
        case .developer: "chevron.left.forwardslash.chevron.right"
        case .client:    "briefcase.fill"
        }
    }

    /// Which scenes this persona surfaces first.
    var featuredScenes: [String] {
        switch self {
        case .recruiter: ["welcome", "timeline", "recruiter", "certificates"]
        case .developer: ["projects", "skills-immersive", "terminal", "ai-assistant"]
        case .client:    ["projects", "freelance", "ai-assistant"]
        }
    }
}
