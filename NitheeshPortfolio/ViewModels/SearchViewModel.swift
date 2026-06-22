// SearchViewModel.swift
// Cross-content search (projects + skills + experiences + certificates).

import Foundation
import Observation

@Observable
final class SearchViewModel {

    enum ResultKind { case project, skill, experience, certificate }

    struct Result: Identifiable, Hashable {
        let id = UUID()
        let kind: ResultKind
        let title: String
        let subtitle: String
        let symbol: String
    }

    var query: String = ""
    var results: [Result] = []

    func runSearch(over portfolio: PortfolioViewModel) {
        let q = query.lowercased().trimmingCharacters(in: .whitespaces)
        guard !q.isEmpty else { results = []; return }

        var hits: [Result] = []

        for p in portfolio.projects where p.name.lowercased().contains(q)
                                       || p.tagline.lowercased().contains(q)
                                       || p.stack.joined(separator: " ").lowercased().contains(q) {
            hits.append(.init(kind: .project, title: p.name, subtitle: p.tagline, symbol: p.iconName))
        }
        for s in portfolio.skills where s.name.lowercased().contains(q) {
            hits.append(.init(kind: .skill, title: s.name, subtitle: s.category.title, symbol: s.symbol))
        }
        for e in portfolio.experiences where e.role.lowercased().contains(q)
                                          || e.organization.lowercased().contains(q) {
            hits.append(.init(kind: .experience, title: e.role, subtitle: e.organization, symbol: "calendar"))
        }
        for c in portfolio.certificates where c.title.lowercased().contains(q) {
            hits.append(.init(kind: .certificate, title: c.title, subtitle: c.issuer, symbol: c.symbol))
        }
        results = hits
    }
}
