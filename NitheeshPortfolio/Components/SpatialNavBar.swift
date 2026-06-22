// SpatialNavBar.swift
// Inline header used inside scenes. Supports an optional trailing-closure slot.

import SwiftUI

struct SpatialNavBar<Trailing: View>: View {
    let title: String
    var subtitle: String?
    let trailing: Trailing

    init(
        title: String,
        subtitle: String? = nil,
        @ViewBuilder trailing: () -> Trailing
    ) {
        self.title = title
        self.subtitle = subtitle
        self.trailing = trailing()
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

// Convenience init for callers that don't need a trailing view.
extension SpatialNavBar where Trailing == EmptyView {
    init(title: String, subtitle: String? = nil) {
        self.init(title: title, subtitle: subtitle) { EmptyView() }
    }
}
