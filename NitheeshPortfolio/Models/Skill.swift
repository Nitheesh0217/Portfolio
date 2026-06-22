// Skill.swift
import Foundation

struct Skill: Identifiable, Hashable {
    let id = UUID()
    let name: String
    let category: Category
    let proficiency: Double     // 0.0 ... 1.0
    let symbol: String          // SF Symbol fallback

    enum Category: String, CaseIterable, Identifiable {
        case frontend, backend, data, cloud, tools
        var id: String { rawValue }
        var title: String {
            switch self {
            case .frontend: "Frontend"
            case .backend:  "Backend"
            case .data:     "Data"
            case .cloud:    "Cloud"
            case .tools:    "Tools"
            }
        }
    }
}
