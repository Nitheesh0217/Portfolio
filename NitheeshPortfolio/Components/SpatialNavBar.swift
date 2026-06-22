// SpatialNavBar.swift
// Inline header used inside scenes. Supports an optional trailing-closure slot.

import SwiftUI

struct SpatialNavBar: View {
    let title: String
    var subtitle: String?
    let trailing: AnyView

    init<Trailing: View>(
        title: String,
        subtitle: String? = nil,
        @ViewBuilder trailing: () -> Trailing
    ) {
        self.title = title
        self.subtitle = subtitle
        self.trailing = AnyView(trailing())
    }

    init(title: String, subtitle: String? = nil) {
        self.title = title
        self.subtitle = subtitle
        self.trailing = AnyView(EmptyView())
    }

    var body: some View {
        HStack(alignment: .center) {
            VStack(alignment: .leading, spacing: 2) {
                Text(title).font(Typography.title2)
                if let subtitle {
                    Text(subtitle).font(Typography.footnote).foregroundStyle(.secondary)
                }
            }
            Spacer()
            trailing
        }
        .padding(.horizontal, Spacing.lg)
        .padding(.vertical, Spacing.md)
    }
}
