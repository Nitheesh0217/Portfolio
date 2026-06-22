// CertificatesScene.swift
import SwiftUI

struct CertificatesScene: View {
    @Environment(PortfolioViewModel.self) private var portfolio
    @State private var selected: Certificate? = nil

    private let columns = [GridItem(.adaptive(minimum: 280, maximum: 360), spacing: Spacing.lg)]

    var body: some View {
        VStack(spacing: 0) {
            SpatialNavBar(title: "Certificates", subtitle: "\(portfolio.certificates.count) earned")

            ScrollView {
                LazyVGrid(columns: columns, spacing: Spacing.lg) {
                    ForEach(portfolio.certificates) { cert in
                        Button { selected = cert } label: {
                            GlassCard {
                                VStack(alignment: .leading, spacing: Spacing.sm) {
                                    Image(systemName: cert.symbol)
                                        .font(.system(size: 32))
                                        .foregroundStyle(AppTheme.Accent.primary)
                                    Text(cert.title).font(Typography.title3)
                                    Text(cert.issuer).font(Typography.callout).foregroundStyle(.secondary)
                                    Text(cert.earned, format: .dateTime.year().month())
                                        .font(Typography.caption).foregroundStyle(.tertiary)
                                }
                                .frame(maxWidth: .infinity, alignment: .leading)
                            }
                        }
                        .buttonStyle(.plain)
                        .hoverEffect(.lift)
                    }
                }
                .padding(Spacing.xl)
            }
        }
        .background(AppTheme.GlassMaterial.panel)
        .sheet(item: $selected) { cert in
            certDetail(cert)
                .frame(minWidth: 520, minHeight: 360)
                .background(.regularMaterial)
        }
    }

    @ViewBuilder
    private func certDetail(_ cert: Certificate) -> some View {
        VStack(alignment: .leading, spacing: Spacing.lg) {
            Image(systemName: cert.symbol).font(.system(size: 56)).foregroundStyle(AppTheme.Accent.primary)
            Text(cert.title).font(Typography.title1)
            Text("Issued by \(cert.issuer)").font(Typography.bodyLarge).foregroundStyle(.secondary)
            Text(cert.earned, format: .dateTime.year().month().day())
                .font(Typography.body).foregroundStyle(.tertiary)
            if let url = cert.verifyURL {
                Link(destination: url) {
                    Label("Verify", systemImage: "checkmark.seal.fill")
                        .padding(.horizontal, Spacing.lg).padding(.vertical, Spacing.sm)
                        .background(AppTheme.Accent.primary, in: Capsule())
                        .foregroundStyle(.white)
                }
                .hoverEffect(.lift)
            }
            Spacer()
            Button("Close") { selected = nil }
                .buttonStyle(.bordered)
                .hoverEffect(.highlight)
        }
        .padding(Spacing.xxl)
    }
}

#Preview("Certificates") {
    CertificatesScene().environment(PortfolioViewModel()).frame(width: 1100, height: 780)
}
