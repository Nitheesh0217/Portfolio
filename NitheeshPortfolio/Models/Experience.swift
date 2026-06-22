// Experience.swift
import Foundation

struct Experience: Identifiable, Hashable {
    let id = UUID()
    let role: String
    let organization: String
    let location: String
    let start: Date
    let end: Date?              // nil = present
    let bullets: [String]
    let kind: Kind

    enum Kind { case work, education }

    var isCurrent: Bool { end == nil }
}
