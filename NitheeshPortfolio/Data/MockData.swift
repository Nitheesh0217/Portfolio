// MockData.swift
// Seed data used by view models. Projects live in ProjectsScene.swift
// (see `Project.all`); everything else is defined here.

import Foundation

enum MockData {

    // NOTE: Projects are declared inside Scenes/ProjectsScene.swift as `Project.all`
    // so that the Project model and its mock data stay co-located.

    static let skills: [Skill] = [
        // Frontend
        .init(name: "React",         category: .frontend, proficiency: 0.95, symbol: "atom"),
        .init(name: "Next.js",       category: .frontend, proficiency: 0.92, symbol: "n.square.fill"),
        .init(name: "TypeScript",    category: .frontend, proficiency: 0.90, symbol: "chevron.left.forwardslash.chevron.right"),
        .init(name: "SwiftUI",       category: .frontend, proficiency: 0.78, symbol: "swift"),
        .init(name: "Tailwind",      category: .frontend, proficiency: 0.92, symbol: "wind"),
        // Backend
        .init(name: "Node.js",       category: .backend,  proficiency: 0.88, symbol: "server.rack"),
        .init(name: "Java",          category: .backend,  proficiency: 0.80, symbol: "cup.and.saucer.fill"),
        .init(name: "Python",        category: .backend,  proficiency: 0.85, symbol: "terminal.fill"),
        .init(name: "REST APIs",     category: .backend,  proficiency: 0.92, symbol: "network"),
        // Data
        .init(name: "SQL",           category: .data,     proficiency: 0.90, symbol: "tablecells.fill"),
        .init(name: "Snowflake",     category: .data,     proficiency: 0.85, symbol: "snowflake"),
        .init(name: "Redshift",      category: .data,     proficiency: 0.80, symbol: "cylinder.fill"),
        .init(name: "Supabase",      category: .data,     proficiency: 0.88, symbol: "bolt.fill"),
        // Cloud
        .init(name: "AWS",           category: .cloud,    proficiency: 0.82, symbol: "cloud.fill"),
        .init(name: "Vercel",        category: .cloud,    proficiency: 0.92, symbol: "triangle.fill"),
        .init(name: "Docker",        category: .cloud,    proficiency: 0.75, symbol: "shippingbox.fill"),
        // Tools
        .init(name: "Git",           category: .tools,    proficiency: 0.95, symbol: "arrow.triangle.branch"),
        .init(name: "Figma",         category: .tools,    proficiency: 0.78, symbol: "paintpalette.fill"),
        .init(name: "Xcode",         category: .tools,    proficiency: 0.72, symbol: "hammer.fill"),
    ]

    static let experiences: [Experience] = [
        .init(
            role: "Data Engineer",
            organization: "CXC Solutions",
            location: "Remote",
            start: date(2024, 1),
            end: nil,
            bullets: [
                "Optimized Snowflake & Redshift ETL — 40% query performance gain.",
                "AWS Lambda event-driven pipelines for real-time ingestion.",
                "React dashboards for warehouse analytics.",
            ],
            kind: .work
        ),
        .init(
            role: "M.S. Data Science & Analytics",
            organization: "Florida Atlantic University",
            location: "Boca Raton, FL",
            start: date(2023, 8),
            end: date(2025, 5),
            bullets: ["GPA 3.6", "Coursework: Machine Learning, Distributed Systems, NLP"],
            kind: .education
        ),
        .init(
            role: "Kore.ai NLU Engineer",
            organization: "Kore.ai",
            location: "Hyderabad, India",
            start: date(2023, 1),
            end: date(2023, 12),
            bullets: [
                "28% human-escalation reduction via NLU bot retraining.",
                "Idempotent webhook handlers for production reliability.",
                "60-day A/B shadow testing with confirmed metrics.",
            ],
            kind: .work
        ),
        .init(
            role: "B.Tech Computer Science",
            organization: "JNTU Kakinada",
            location: "India",
            start: date(2018, 8),
            end: date(2022, 6),
            bullets: ["First-class honours"],
            kind: .education
        ),
    ]

    static let certificates: [Certificate] = [
        .init(title: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services",
              earned: date(2024, 6), verifyURL: nil, symbol: "cloud.fill"),
        .init(title: "Snowflake SnowPro Core",          issuer: "Snowflake",
              earned: date(2024, 3), verifyURL: nil, symbol: "snowflake"),
        .init(title: "Meta Front-End Developer",         issuer: "Meta · Coursera",
              earned: date(2023, 11), verifyURL: nil, symbol: "atom"),
    ]

    private static func date(_ y: Int, _ m: Int) -> Date {
        var c = DateComponents(); c.year = y; c.month = m; c.day = 1
        return Calendar.current.date(from: c) ?? Date()
    }
}
