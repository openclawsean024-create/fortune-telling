'use client';

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import React from 'react';

// Register Chinese font via CDN (bypasses Vercel 4.5MB static file limit)
Font.register({
  family: 'NotoSansTC',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-tc@5.0.0/files/noto-sans-tc-chinese-traditional-400-normal.woff2',
      fontWeight: 'normal',
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-tc@5.0.0/files/noto-sans-tc-chinese-traditional-700-normal.woff2',
      fontWeight: 'bold',
    },
  ],
});

const s = StyleSheet.create({
  page: { padding: 30, fontFamily: 'NotoSansTC', position: 'relative', backgroundColor: '#ffffff' },
  pageNumber: { position: 'absolute', bottom: 20, right: 30, fontSize: 10, color: '#9ca3af' },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#7c3aed' },
  subHeader: { fontSize: 11, textAlign: 'center', color: '#6b7280', marginBottom: 16 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 8, color: '#4b5563', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 4 },
  palaceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  palaceItem: { width: '30%', padding: 6, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 4 },
  palaceLabel: { fontSize: 7, color: '#6b7280', marginBottom: 2 },
  palaceValue: { fontSize: 9, fontWeight: 'bold', color: '#7c3aed' },
  card: { padding: 8, backgroundColor: '#f9fafb', borderRadius: 4, marginBottom: 6 },
  text: { fontSize: 9, color: '#374151', marginBottom: 3, lineHeight: 1.4 },
  boldLabel: { fontSize: 9, fontWeight: 'bold', color: '#374151', marginBottom: 2 },
  row: { flexDirection: 'row', gap: 8 },
  col: { flex: 1 },
  infoRow: { flexDirection: 'row', gap: 16, marginBottom: 6 },
  infoItem: { flex: 1 },
  footer: { fontSize: 8, color: '#9ca3af', textAlign: 'center', marginTop: 16 },
});

function CoverPage({ report }: { report: any }) {
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.header}>全方位命理分析報告</Text>
      <Text style={s.subHeader}>Comprehensive Fortune Analysis Report</Text>
      <View style={s.card}>
        <Text style={{ ...s.text, fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: '#7c3aed', marginBottom: 12 }}>
          {report.birthInfo?.name || '命理報告'}
        </Text>
        <View style={s.infoRow}>
          <View style={s.infoItem}>
            <Text style={s.boldLabel}>出生日期</Text>
            <Text style={s.text}>{report.birthInfo?.birthDate}</Text>
          </View>
          <View style={s.infoItem}>
            <Text style={s.boldLabel}>出生時間</Text>
            <Text style={s.text}>{report.birthInfo?.birthTime}</Text>
          </View>
        </View>
        <View style={s.infoRow}>
          <View style={s.infoItem}>
            <Text style={s.boldLabel}>曆法</Text>
            <Text style={s.text}>{report.birthInfo?.isLunar ? '農曆' : '國曆'}</Text>
          </View>
          <View style={s.infoItem}>
            <Text style={s.boldLabel}>生成時間</Text>
            <Text style={s.text}>{new Date(report.createdAt).toLocaleString('zh-TW')}</Text>
          </View>
        </View>
      </View>
      <View style={s.section}>
        <Text style={s.sectionTitle}>報告內容</Text>
        <View style={s.card}>
          {report.ziwu && <Text style={s.text}>• 紫微斗數命盤</Text>}
          {report.bazi && <Text style={s.text}>• 八字命盤</Text>}
          {report.tarot && <Text style={s.text}>• 塔羅占卜</Text>}
          {report.lifePath && <Text style={s.text}>• 生命靈數</Text>}
          {report.zodiac && <Text style={s.text}>• 生肖星座</Text>}
        </View>
      </View>
      <Text style={s.footer}>此報告由全方位算命網站 AI 自動生成 · 僅供參考</Text>
      <Text style={s.pageNumber}>1</Text>
    </Page>
  );
}

function ZiwuPage({ report }: { report: any }) {
  if (!report.ziwu) return null;
  const entries = Object.entries(report.ziwu);
  const mid = Math.ceil(entries.length / 2);
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.header}>紫微斗數命盤</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          {entries.slice(0, mid).map(([key, value]) => (
            <View key={key} style={s.palaceItem}>
              <Text style={s.palaceLabel}>{key}</Text>
              <Text style={s.palaceValue}>{String(value)}</Text>
            </View>
          ))}
        </View>
        <View style={{ flex: 1 }}>
          {entries.slice(mid).map(([key, value]) => (
            <View key={key} style={s.palaceItem}>
              <Text style={s.palaceLabel}>{key}</Text>
              <Text style={s.palaceValue}>{String(value)}</Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={s.pageNumber}>2</Text>
    </Page>
  );
}

function BaziPage({ report }: { report: any }) {
  if (!report.bazi) return null;
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.header}>八字命盤</Text>
      <View style={s.section}>
        <Text style={s.sectionTitle}>四柱</Text>
        <View style={s.row}>
          <View style={s.col}>
            <View style={s.card}><Text style={s.boldLabel}>年柱</Text><Text style={s.text}>{report.bazi.年柱}</Text></View>
            <View style={s.card}><Text style={s.boldLabel}>月柱</Text><Text style={s.text}>{report.bazi.月柱}</Text></View>
          </View>
          <View style={s.col}>
            <View style={s.card}><Text style={s.boldLabel}>日柱</Text><Text style={s.text}>{report.bazi.日柱}</Text></View>
            <View style={s.card}><Text style={s.boldLabel}>時柱</Text><Text style={s.text}>{report.bazi.時柱}</Text></View>
          </View>
        </View>
      </View>
      <View style={s.section}>
        <Text style={s.sectionTitle}>分析</Text>
        <View style={s.card}><Text style={s.boldLabel}>五行分析</Text><Text style={s.text}>{report.bazi.五行分析}</Text></View>
        <View style={s.card}><Text style={s.boldLabel}>性格特點</Text><Text style={s.text}>{report.bazi.性格特點}</Text></View>
      </View>
      <Text style={s.pageNumber}>3</Text>
    </Page>
  );
}

function TarotPage({ report }: { report: any }) {
  if (!report.tarot) return null;
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.header}>塔羅占卜</Text>
      <View style={s.section}>
        {[
          { label: '牌名', value: report.tarot.card },
          { label: '正逆位', value: report.tarot.position },
          { label: '牌面含義', value: report.tarot.meaning },
          { label: '占卜解讀', value: report.tarot.description },
        ].map(({ label, value }) => (
          <View key={label} style={s.card}>
            <Text style={s.boldLabel}>{label}</Text>
            <Text style={s.text}>{value}</Text>
          </View>
        ))}
      </View>
      <Text style={s.pageNumber}>4</Text>
    </Page>
  );
}

function LifePathPage({ report }: { report: any }) {
  if (!report.lifePath) return null;
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.header}>生命靈數</Text>
      <View style={s.section}>
        <View style={s.card}>
          <Text style={s.boldLabel}>靈魂數字</Text>
          <Text style={{ ...s.text, fontSize: 18, fontWeight: 'bold', color: '#7c3aed', textAlign: 'center', marginVertical: 8 }}>
            {report.lifePath.number}
          </Text>
        </View>
        <View style={s.card}><Text style={s.boldLabel}>性格描述</Text><Text style={s.text}>{report.lifePath.description}</Text></View>
        {report.lifePath.strengths && <View style={s.card}><Text style={s.boldLabel}>優點</Text><Text style={s.text}>{report.lifePath.strengths}</Text></View>}
        {report.lifePath.challenges && <View style={s.card}><Text style={s.boldLabel}>挑戰</Text><Text style={s.text}>{report.lifePath.challenges}</Text></View>}
      </View>
      <Text style={s.pageNumber}>5</Text>
    </Page>
  );
}

function ZodiacPage({ report }: { report: any }) {
  if (!report.zodiac) return null;
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.header}>生肖星座</Text>
      <View style={s.section}>
        <View style={s.card}>
          <View style={s.row}>
            <View style={s.col}><Text style={s.boldLabel}>生肖</Text><Text style={s.text}>{report.zodiac.zodiac}</Text></View>
            <View style={s.col}><Text style={s.boldLabel}>五行</Text><Text style={s.text}>{report.zodiac.element}</Text></View>
          </View>
        </View>
        <View style={s.card}><Text style={s.boldLabel}>運勢描述</Text><Text style={s.text}>{report.zodiac.description}</Text></View>
        <View style={s.card}><Text style={s.boldLabel}>幸運數字</Text><Text style={s.text}>{report.zodiac.luckyNumbers?.join(', ')}</Text></View>
        {report.zodiac.compatibleSigns && <View style={s.card}><Text style={s.boldLabel}>相配星座</Text><Text style={s.text}>{report.zodiac.compatibleSigns}</Text></View>}
      </View>
      <Text style={s.footer}>此報告由全方位算命網站 AI 自動生成 · 僅供參考</Text>
      <Text style={s.pageNumber}>6</Text>
    </Page>
  );
}

function FortunePDF({ report }: { report: any }) {
  return (
    <Document>
      <CoverPage report={report} />
      {report.ziwu && <ZiwuPage report={report} />}
      {report.bazi && <BaziPage report={report} />}
      {report.tarot && <TarotPage report={report} />}
      {report.lifePath && <LifePathPage report={report} />}
      {report.zodiac && <ZodiacPage report={report} />}
    </Document>
  );
}

// Export a function that returns the button React element
export default function PDFExportClient(report: any) {
  return (
    <PDFDownloadLink
      document={<FortunePDF report={report} />}
      fileName={`命理報告-${report.id}.pdf`}
      className="inline-flex items-center gap-2 py-2 px-4 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all"
    >
      {({ loading }: { loading: boolean }) =>
        loading ? '生成中...' : '📄 匯出 PDF'
      }
    </PDFDownloadLink>
  );
}
