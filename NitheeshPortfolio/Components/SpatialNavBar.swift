// SpatialNavBar.swift
// Optional inline nav bar (used inside scenes that need their own header).

import SwiftUI

struct SpatialNavBar: View {
    let title: String
    var subtitle: String? = nil
    var trailing: AnyView? = nil

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
