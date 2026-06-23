// ProjectsScene.swift
// Scene Type: WindowGroup (gallery) + secondary WindowGroup (detail)
// UX Pattern:
//   → Gallery: cards float side-by-side in space (ref: image.jpg — 3-panel spatial layout)
//   → Selected: large center preview + side detail panel + bottom filmstrip ornament
//               (ref: image-2.jpg — visionOS Photos spatial layout)

import SwiftUI
import RealityKit

// MARK: - Data Model

struct Project: Identifiable, Hashable {
    let id = UUID()
    let name: String
    let tagline: String
    let description: String
    let stack: [String]
    let liveURL: String
    let githubURL: String
    let accentColor: Color
    let iconName: String         // SF Symbol
    let year: String
    let status: String           // "Live", "In Progress", etc.
    let highlights: [String]
}

// MARK: - Mock Data

extension Project {
    static let all: [Project] = [
        Project(
            name: "Coach Jake",
            tagline: "AI-Powered Fitness Coaching",
            description: "A full-stack AI fitness app that generates personalized workout plans, tracks progress, and provides real-time coaching feedback using OpenAI GPT-4. Built with Next.js, Supabase, and Tailwind.",
            stack: ["Next.js", "TypeScript", "Supabase", "OpenAI GPT-4", "Tailwind CSS", "Node.js"],
            liveURL: "https://coach-jake-app.vercel.app",
            githubURL: "https://github.com/Nitheesh0217/coach-jake-app",
            accentColor: .teal,
            iconName: "figure.run.circle.fill",
            year: "2024",
            status: "Live",
            highlights: [
                "GPT-4 powered workout plan generation",
                "Real-time progress tracking with Supabase Realtime",
                "Personalized nutrition recommendations",
                "300+ active users in first month"
            ]
        ),
        Project(
            name: "D Scent House",
            tagline: "Premium E-Commerce Experience",
            description: "A high-end perfume e-commerce platform with product catalog, cart, Stripe checkout, and admin dashboard. Features full-text search, filtering, and order management.",
            stack: ["Next.js", "TypeScript", "Stripe", "Supabase", "Tailwind CSS", "PostgreSQL", "pg_notify"],
            liveURL: "https://d-scent-house.vercel.app",
            githubURL: "https://github.com/Nitheesh0217/d-scent-house",
            accentColor: .purple,
            iconName: "bag.fill",
            year: "2024",
            status: "Live",
            highlights: [
                "Stripe payment integration",
                "Full admin dashboard for inventory",
                "Full-text product search with Supabase",
                "Mobile-first responsive design"
            ]
        ),
        Project(
            name: "Portfolio OS",
            tagline: "Spatial OS Portfolio Experience",
            description: "This very visionOS app — a spatial computing portfolio that reimagines a developer portfolio as a native Apple Vision Pro experience with floating windows, immersive spaces, and AI chat.",
            stack: ["SwiftUI", "visionOS", "RealityKit", "Swift", "Xcode"],
            liveURL: "https://github.com/Nitheesh0217/Portfolio",
            githubURL: "https://github.com/Nitheesh0217/Portfolio",
            accentColor: .orange,
            iconName: "vision.pro",
            year: "2025",
            status: "In Progress",
            highlights: [
                "Native visionOS spatial windows",
                "RealityKit immersive skills space",
                "AI assistant with OpenAI streaming",
                "Persona-based navigation system"
            ]
        )
    ]
}

// MARK: - Gallery View (entry state — 3 cards floating in space)

struct ProjectsScene: View {
    @State private var selectedProject: Project? = nil
    @State private var appeared = false
    @Namespace private var heroNamespace

    var body: some View {
        Group {
            if let project = selectedProject {
                // ── DETAIL STATE: large preview + side panel + filmstrip
                ProjectDetailView(
                    project: project,
                    allProjects: Project.all,
                    namespace: heroNamespace,
                    onBack: {
                        withAnimation(.spring(duration: 0.5, bounce: 0.15)) {
                            selectedProject = nil
                        }
                    },
                    onSelect: { p in
                        withAnimation(.spring(duration: 0.4, bounce: 0.1)) {
                            selectedProject = p
                        }
                    }
                )
            } else {
                // ── GALLERY STATE: 3 panels side by side
                ProjectGalleryView(
                    projects: Project.all,
                    namespace: heroNamespace,
                    onSelect: { p in
                        withAnimation(.spring(duration: 0.5, bounce: 0.15)) {
                            selectedProject = p
                        }
                    }
                )
            }
        }
        .frame(minWidth: 1100, minHeight: 680)
        .glassBackgroundEffect()
    }
}

// MARK: - Gallery View (3-panel spatial layout — ref: image.jpg)

struct ProjectGalleryView: View {
    let projects: [Project]
    let namespace: Namespace.ID
    let onSelect: (Project) -> Void

    @State private var appeared = false
    @State private var hoveredID: UUID? = nil

    var body: some View {
        VStack(spacing: 0) {

            // Header
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Projects")
                        .font(.system(size: 34, weight: .bold))
                        .foregroundStyle(.white)
                    Text("\(projects.count) projects · All live")
                        .font(.system(size: 15))
                        .foregroundStyle(.white.opacity(0.5))
                }
                Spacer()
                // Filter chips
                HStack(spacing: 8) {
                    FilterChip(label: "All", isActive: true)
                    FilterChip(label: "Full-Stack", isActive: false)
                    FilterChip(label: "AI", isActive: false)
                    FilterChip(label: "visionOS", isActive: false)
                }
            }
            .padding(.horizontal, 40)
            .padding(.top, 36)
            .padding(.bottom, 28)
            .opacity(appeared ? 1 : 0)
            .animation(.spring(duration: 0.6).delay(0.05), value: appeared)

            // ── 3-Panel spatial gallery (like image.jpg: left tall, center wide, right tall)
            HStack(alignment: .center, spacing: 16) {
                ForEach(Array(projects.enumerated()), id: \.element.id) { index, project in
                    ProjectGalleryCard(
                        project: project,
                        index: index,
                        namespace: namespace,
                        isHovered: hoveredID == project.id,
                        appeared: appeared,
                        onHover: { hovering in
                            hoveredID = hovering ? project.id : nil
                        },
                        onTap: { onSelect(project) }
                    )
                    // Center card is wider (like the center panel in image.jpg)
                    .frame(
                        width: index == 1 ? 420 : 280,
                        height: index == 1 ? 480 : 420
                    )
                }
            }
            .padding(.horizontal, 32)
            .padding(.bottom, 40)
        }
        .onAppear {
            withAnimation(.spring(duration: 0.8, bounce: 0.2).delay(0.1)) {
                appeared = true
            }
        }
    }
}

// MARK: - Individual Gallery Card

struct ProjectGalleryCard: View {
    let project: Project
    let index: Int
    let namespace: Namespace.ID
    let isHovered: Bool
    let appeared: Bool
    let onHover: (Bool) -> Void
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            ZStack(alignment: .bottomLeading) {

                // Background gradient (project accent)
                RoundedRectangle(cornerRadius: 20)
                    .fill(
                        LinearGradient(
                            colors: [
                                project.accentColor.opacity(0.25),
                                Color(white: 0.08)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )

                // Subtle grid pattern overlay
                RoundedRectangle(cornerRadius: 20)
                    .fill(.ultraThinMaterial)
                    .opacity(0.3)

                // RealityView placeholder (volumetric preview)
                VStack {
                    // TODO: Replace with RealityView for 3D project preview
                    Image(systemName: project.iconName)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 80, height: 80)
                        .foregroundStyle(project.accentColor.opacity(0.8))
                        .shadow(color: project.accentColor.opacity(0.5), radius: 20)
                        .padding(.top, 40)
                    Spacer()
                }

                // Bottom overlay — project info
                VStack(alignment: .leading, spacing: 6) {

                    // Status badge
                    Text(project.status)
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundStyle(project.status == "Live" ? .green : .orange)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(
                            project.status == "Live"
                                ? Color.green.opacity(0.15)
                                : Color.orange.opacity(0.15),
                            in: Capsule()
                        )

                    Text(project.name)
                        .font(.system(size: 20, weight: .bold))
                        .foregroundStyle(.white)
                        .matchedGeometryEffect(id: "title-\(project.id)", in: namespace)

                    Text(project.tagline)
                        .font(.system(size: 13))
                        .foregroundStyle(.white.opacity(0.65))
                        .lineLimit(2)

                    // Stack pills
                    HStack(spacing: 6) {
                        ForEach(project.stack.prefix(3), id: \.self) { tech in
                            Text(tech)
                                .font(.system(size: 10, weight: .medium))
                                .foregroundStyle(.white.opacity(0.7))
                                .padding(.horizontal, 8)
                                .padding(.vertical, 3)
                                .background(.white.opacity(0.1), in: Capsule())
                        }
                        if project.stack.count > 3 {
                            Text("+\(project.stack.count - 3)")
                                .font(.system(size: 10, weight: .medium))
                                .foregroundStyle(.white.opacity(0.5))
                        }
                    }
                }
                .padding(20)
                .background(
                    LinearGradient(
                        colors: [.clear, .black.opacity(0.7)],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
            }
            .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 20)
                    .stroke(
                        isHovered
                            ? project.accentColor.opacity(0.6)
                            : .white.opacity(0.1),
                        lineWidth: isHovered ? 1.5 : 1
                    )
            )
            // Hover lift effect (spring animation)
            .scaleEffect(isHovered ? 1.03 : 1.0)
            .shadow(
                color: isHovered ? project.accentColor.opacity(0.4) : .black.opacity(0.3),
                radius: isHovered ? 28 : 12,
                y: isHovered ? 12 : 4
            )
            // Staggered entrance
            .opacity(appeared ? 1 : 0)
            .offset(y: appeared ? 0 : 24)
            .animation(
                .spring(duration: 0.7, bounce: 0.25).delay(Double(index) * 0.1 + 0.15),
                value: appeared
            )
            .animation(.spring(duration: 0.3, bounce: 0.2), value: isHovered)
        }
        .buttonStyle(.plain)
        .hoverEffect(.lift)
        .onHover { onHover($0) }
    }
}

// MARK: - Detail View (ref: image-2.jpg — large center + side panel + bottom filmstrip)

struct ProjectDetailView: View {
    let project: Project
    let allProjects: [Project]
    let namespace: Namespace.ID
    let onBack: () -> Void
    let onSelect: (Project) -> Void

    @State private var activeTab: DetailTab = .overview
    @Environment(\.openURL) private var openURL

    enum DetailTab: String, CaseIterable {
        case overview = "Overview"
        case stack    = "Tech Stack"
        case links    = "Links"
    }

    var body: some View {
        VStack(spacing: 0) {

            // ── TOP BAR
            detailTopBar

            // ── MAIN CONTENT: Left preview + Right detail panel (like image-2.jpg)
            HStack(spacing: 0) {

                // LEFT: Live website preview (large center panel in image-2.jpg)
                livePreviewPanel
                    .frame(maxWidth: .infinity)

                // Divider
                Rectangle()
                    .fill(.white.opacity(0.08))
                    .frame(width: 1)
                    .padding(.vertical, 20)

                // RIGHT: Project detail panel
                projectDetailPanel
                    .frame(width: 340)
            }
            .frame(maxHeight: .infinity)

            // ── BOTTOM FILMSTRIP ORNAMENT (ref: image-2.jpg — horizontal thumbnails at bottom)
        }
        .ornament(attachmentAnchor: .scene(.bottom)) {
            filmstripOrnament
        }
    }

    // MARK: Top Bar
    private var detailTopBar: some View {
        HStack(spacing: 14) {
            // Back button
            Button(action: onBack) {
                HStack(spacing: 6) {
                    Image(systemName: "chevron.left")
                        .font(.system(size: 14, weight: .semibold))
                    Text("Projects")
                        .font(.system(size: 15, weight: .medium))
                }
                .foregroundStyle(.white.opacity(0.8))
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .background(.white.opacity(0.08), in: Capsule())
            }
            .buttonStyle(.plain)
            .hoverEffect(.highlight)

            // Project name
            Text(project.name)
                .font(.system(size: 18, weight: .semibold))
                .foregroundStyle(.white)
                .matchedGeometryEffect(id: "title-\(project.id)", in: namespace)

            Spacer()

            // Status
            Text(project.status)
                .font(.system(size: 12, weight: .semibold))
                .foregroundStyle(project.status == "Live" ? .green : .orange)
                .padding(.horizontal, 12)
                .padding(.vertical, 5)
                .background(
                    project.status == "Live"
                        ? Color.green.opacity(0.15)
                        : Color.orange.opacity(0.15),
                    in: Capsule()
                )

            // Year
            Text(project.year)
                .font(.system(size: 13))
                .foregroundStyle(.white.opacity(0.4))
        }
        .padding(.horizontal, 28)
        .padding(.vertical, 16)
        .background(.white.opacity(0.04))
    }

    // MARK: Left — Live Preview
    private var livePreviewPanel: some View {
        VStack(spacing: 0) {
            // Mini browser chrome (like image-1 reference — dark browser frame)
            HStack(spacing: 8) {
                // Traffic lights
                HStack(spacing: 6) {
                    Circle().fill(Color(red: 1, green: 0.37, blue: 0.34)).frame(width: 10, height: 10)
                    Circle().fill(Color(red: 1, green: 0.74, blue: 0.18)).frame(width: 10, height: 10)
                    Circle().fill(Color(red: 0.23, green: 0.76, blue: 0.37)).frame(width: 10, height: 10)
                }
                // URL bar
                HStack(spacing: 6) {
                    Image(systemName: "lock.fill")
                        .font(.system(size: 10))
                        .foregroundStyle(.white.opacity(0.4))
                    Text(project.liveURL)
                        .font(.system(size: 12))
                        .foregroundStyle(.white.opacity(0.6))
                        .lineLimit(1)
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 5)
                .background(.white.opacity(0.07), in: RoundedRectangle(cornerRadius: 6))
                .frame(maxWidth: 320)
                Spacer()
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(Color(white: 0.09))

            // Website preview placeholder
            // TODO: Replace with WKWebView wrapped in UIViewRepresentable
            ZStack {
                Rectangle()
                    .fill(
                        LinearGradient(
                            colors: [
                                project.accentColor.opacity(0.15),
                                Color(white: 0.06)
                            ],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )

                VStack(spacing: 20) {
                    Image(systemName: project.iconName)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 64, height: 64)
                        .foregroundStyle(project.accentColor.opacity(0.7))
                        .shadow(color: project.accentColor.opacity(0.5), radius: 24)

                    Text("Live Preview")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundStyle(.white.opacity(0.4))

                    // Open in new window button
                    Button {
                        openURL(URL(string: project.liveURL)!)
                    } label: {
                        Label("Open Live Site", systemImage: "arrow.up.right.square")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundStyle(.white)
                            .padding(.horizontal, 20)
                            .padding(.vertical, 10)
                            .background(project.accentColor.opacity(0.3), in: Capsule())
                    }
                    .buttonStyle(.plain)
                    .hoverEffect(.lift)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }

    // MARK: Right — Project Detail Panel
    private var projectDetailPanel: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {

                // Icon + name
                HStack(spacing: 14) {
                    ZStack {
                        RoundedRectangle(cornerRadius: 16)
                            .fill(project.accentColor.opacity(0.2))
                            .frame(width: 52, height: 52)
                        Image(systemName: project.iconName)
                            .font(.system(size: 24))
                            .foregroundStyle(project.accentColor)
                    }
                    VStack(alignment: .leading, spacing: 2) {
                        Text(project.name)
                            .font(.system(size: 20, weight: .bold))
                            .foregroundStyle(.white)
                        Text(project.year)
                            .font(.system(size: 13))
                            .foregroundStyle(.white.opacity(0.45))
                    }
                }

                // Description
                Text(project.description)
                    .font(.system(size: 14))
                    .foregroundStyle(.white.opacity(0.7))
                    .lineSpacing(4)
                    .fixedSize(horizontal: false, vertical: true)

                // Tab switcher
                HStack(spacing: 0) {
                    ForEach(DetailTab.allCases, id: \.self) { tab in
                        Button {
                            withAnimation(.spring(duration: 0.25)) {
                                activeTab = tab
                            }
                        } label: {
                            Text(tab.rawValue)
                                .font(.system(size: 13, weight: activeTab == tab ? .semibold : .regular))
                                .foregroundStyle(activeTab == tab ? .white : .white.opacity(0.45))
                                .padding(.horizontal, 14)
                                .padding(.vertical, 8)
                                .background(
                                    activeTab == tab
                                        ? .white.opacity(0.12)
                                        : .clear,
                                    in: RoundedRectangle(cornerRadius: 8)
                                )
                        }
                        .buttonStyle(.plain)
                    }
                }
                .background(.white.opacity(0.05), in: RoundedRectangle(cornerRadius: 10))

                // Tab content
                switch activeTab {
                case .overview:   overviewTab
                case .stack:      stackTab
                case .links:      linksTab
                }
            }
            .padding(24)
        }
    }

    // MARK: Overview Tab
    private var overviewTab: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Highlights")
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(.white.opacity(0.5))
                .textCase(.uppercase)
                .kerning(0.8)

            ForEach(project.highlights, id: \.self) { highlight in
                HStack(alignment: .top, spacing: 10) {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundStyle(project.accentColor)
                        .font(.system(size: 14))
                    Text(highlight)
                        .font(.system(size: 14))
                        .foregroundStyle(.white.opacity(0.75))
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
        }
    }

    // MARK: Stack Tab
    private var stackTab: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Technologies")
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(.white.opacity(0.5))
                .textCase(.uppercase)
                .kerning(0.8)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 8) {
                ForEach(project.stack, id: \.self) { tech in
                    HStack(spacing: 8) {
                        Circle()
                            .fill(project.accentColor.opacity(0.7))
                            .frame(width: 6, height: 6)
                        Text(tech)
                            .font(.system(size: 13, weight: .medium))
                            .foregroundStyle(.white.opacity(0.8))
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(.white.opacity(0.07), in: RoundedRectangle(cornerRadius: 8))
                }
            }
        }
    }

    // MARK: Links Tab
    private var linksTab: some View {
        VStack(alignment: .leading, spacing: 10) {
            detailLinkButton(
                label: "View Live Site",
                icon: "safari.fill",
                color: .teal,
                url: project.liveURL
            )
            detailLinkButton(
                label: "View on GitHub",
                icon: "chevron.left.forwardslash.chevron.right",
                color: .white,
                url: project.githubURL
            )
        }
    }

    private func detailLinkButton(
        label: String,
        icon: String,
        color: Color,
        url: String
    ) -> some View {
        Button {
            openURL(URL(string: url)!)
        } label: {
            HStack(spacing: 10) {
                Image(systemName: icon)
                    .font(.system(size: 15))
                    .foregroundStyle(color)
                Text(label)
                    .font(.system(size: 15, weight: .medium))
                    .foregroundStyle(.white)
                Spacer()
                Image(systemName: "arrow.up.right")
                    .font(.system(size: 12))
                    .foregroundStyle(.white.opacity(0.4))
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(.white.opacity(0.07), in: RoundedRectangle(cornerRadius: 12))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(.white.opacity(0.1), lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
        .hoverEffect(.lift)
    }

    // MARK: Bottom Filmstrip Ornament (ref: image-2.jpg — horizontal thumbnails)
    private var filmstripOrnament: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(allProjects) { p in
                    Button { onSelect(p) } label: {
                        ZStack(alignment: .bottomLeading) {
                            RoundedRectangle(cornerRadius: 12)
                                .fill(
                                    LinearGradient(
                                        colors: [p.accentColor.opacity(0.3), Color(white: 0.1)],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                                .frame(width: 100, height: 68)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(
                                            p.id == project.id
                                                ? p.accentColor
                                                : .white.opacity(0.1),
                                            lineWidth: p.id == project.id ? 2 : 1
                                        )
                                )

                            Image(systemName: p.iconName)
                                .font(.system(size: 22))
                                .foregroundStyle(p.accentColor.opacity(0.8))
                                .frame(maxWidth: .infinity, maxHeight: .infinity)

                            Text(p.name)
                                .font(.system(size: 10, weight: .medium))
                                .foregroundStyle(.white.opacity(0.8))
                                .padding(.horizontal, 6)
                                .padding(.bottom, 5)
                        }
                        .scaleEffect(p.id == project.id ? 1.05 : 1.0)
                    }
                    .buttonStyle(.plain)
                    .hoverEffect(.highlight)
                    .animation(.spring(duration: 0.25), value: project.id)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
        }
        .frame(width: 380, height: 88)
        .glassBackgroundEffect()
    }
}

// MARK: - Filter Chip

struct FilterChip: View {
    let label: String
    let isActive: Bool

    var body: some View {
        Text(label)
            .font(.system(size: 13, weight: isActive ? .semibold : .regular))
            .foregroundStyle(isActive ? .white : .white.opacity(0.5))
            .padding(.horizontal, 14)
            .padding(.vertical, 7)
            .background(
                isActive ? .white.opacity(0.15) : .white.opacity(0.06),
                in: Capsule()
            )
            .overlay(Capsule().stroke(.white.opacity(isActive ? 0.3 : 0.1), lineWidth: 1))
    }
}

// MARK: - Preview

#Preview("Gallery", windowStyle: .plain) {
    ProjectsScene()
        .frame(width: 1100, height: 680)
}

#Preview("Detail", windowStyle: .plain) {
    ProjectDetailView(
        project: Project.all[0],
        allProjects: Project.all,
        namespace: Namespace().wrappedValue,
        onBack: {},
        onSelect: { _ in }
    )
    .frame(width: 1100, height: 680)
    .glassBackgroundEffect()
}
