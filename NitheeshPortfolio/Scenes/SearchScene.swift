// SearchScene.swift
// Lives inside a popover, not a window.

import SwiftUI

struct SearchScene: View {
    @Environment(PortfolioViewModel.self) private var portfolio
    @State private var vm = SearchViewModel()
    @FocusState private var focused: Bool

    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: Spacing.sm) {
                Image(systemName: "magnifyingglass").foregroundStyle(.secondary)
                TextField("Search projects, skills, experience…", text: $vm.query)
                    .textFieldStyle(.plain)
                    .font(Typography.bodyLarge)
                    .focused($focused)
                    .onChange(of: vm.query) { _, _ in vm.runSearch(over: portfolio) }
            }
            .padding(Spacing.md)
            .background(.regularMaterial)

            Divider().opacity(0.3)

            if vm.results.isEmpty {
                ContentUnavailableView("Type to search", systemImage: "magnifyingglass")
                    .padding(Spacing.xl)
            } else {
                ScrollView {
                    LazyVStack(spacing: Spacing.xs) {
                        ForEach(vm.results) { hit in
                            HStack(spacing: Spacing.md) {
                                Image(systemName: hit.symbol)
                                    .frame(width: 32)
                                    .foregroundStyle(AppTheme.Accent.primary)
                                VStack(alignment: .leading) {
                                    Text(hit.title).font(Typography.callout)
                                    Text(hit.subtitle).font(Typography.caption).foregroundStyle(.secondary)
                                }
                                Spacer()
                            }
                            .padding(Spacing.sm)
                            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: AppTheme.Radius.sm))
                            .hoverEffect(.highlight)
                        }
                    }
                    .padding(Spacing.md)
                }
            }
        }
        .onAppear { focused = true }
    }
}

#Preview("Search") {
    SearchScene().environment(PortfolioViewModel()).frame(width: 540, height: 480)
}
