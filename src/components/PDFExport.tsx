'use client';

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { FortuneReport } from '@/types';

// Register Chinese font — must happen before any PDF rendering
Font.register({
  family: 'NotoSansTC',
  src: '/fonts/NotoSansTC-Regular.otf',
});

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'NotoSansTC', position: 'relative' },
  pageNumber: { position: 'absolute', bottom: 20, right: 30, fontSize: 10, color: '#9ca3af' },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#7c3aed' },
  subHeader: { fontSize: 12, textAlign: 'center', color: '#6b7280', marginBottom: 16 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#4b5563', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 4 },
  palaceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  palaceItem: { width: '30%', padding: 8, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 4 },
  palaceLabel: { fontSize: 7, color: '#6b7280', marginBottom: 2 },
  palaceValue: { fontSize: 10, fontWeight: 'bold', color: '#7c3aed' },
  card: { padding: 8, backgroundColor: '#f9fafb', borderRadius: 4, marginBottom: 8 },
  text: { fontSize: 10, color: '#374151', marginBottom: 3, lineHeight: 1.4 },
  textSmall: { fontSize: 8, color: '#6b7280', marginBottom: 2 },
  row: { flexDirection: 'row', gap: 8 },
  col: { flex: 1 },
  boldLabel: { fontSize: 10, fontWeight: 'bold', color: '#374151', marginBottom: 2 },
  footer: { fontSize: 8, color: '#9ca3af', textAlign: 'center', marginTop: 20 },
  coverSection: { marginBottom: 20 },
  infoRow: { flexDirection: 'row', gap: 16, marginBottom: 6 },
  infoItem: { flex: 1 },
});

interface PDFDocumentProps {
  report: FortuneReport;
}

function CoverPage({ report }: { report: FortuneReport }) {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>全方位命理分析報告</Text>
      <Text style={styles.subHeader}>Comprehensive Fortune Analysis Report</Text>

      <View style={styles.coverSection}>
        <Text style={{ ...styles.text, fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: '#7c3aed', marginBottom: 16 }}>
          {report.birthInfo.name || '命理報告'}
        </Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.boldLabel}>出生日期</Text>
              <Text style={styles.text}>{report.birthInfo.birthDate}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.boldLabel}>出生時間</Text>
              <Text style={styles.text}>{report.birthInfo.birthTime}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.boldLabel}>曆法</Text>
              <Text style={styles.text}>{report.birthInfo.isLunar ? '農曆' : '國曆'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.boldLabel}>生成時間</Text>
              <Text style={styles.text}>{new Date(report.createdAt).toLocaleString('zh-TW')}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Table of contents */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>報告內容</Text>
        <View style={styles.card}>
          {report.ziwu && <Text style={styles.text}>• 紫微斗數命盤</Text>}
          {report.bazi && <Text style={styles.text}>• 八字命盤</Text>}
          {report.tarot && <Text style={styles.text}>• 塔羅占卜</Text>}
          {report.lifePath && <Text style={styles.text}>• 生命靈數</Text>}
          {report.zodiac && <Text style={styles.text}>• 生肖星座</Text>}
        </View>
      </View>

      <Text style={styles.footer}>
        此報告由全方位算命網站 AI 自動生成 · 僅供參考
      </Text>
      <Text style={styles.pageNumber}>1</Text>
    </Page>
  );
}

function ZiwuPage({ report }: { report: FortuneReport }) {
  if (!report.ziwu) return null;
  const entries = Object.entries(report.ziwu);
  const mid = Math.ceil(entries.length / 2);
  const left = entries.slice(0, mid);
  const right = entries.slice(mid);

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>紫微斗數命盤</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          {left.map(([key, value]) => (
            <View key={key} style={styles.palaceItem}>
              <Text style={styles.palaceLabel}>{key}</Text>
              <Text style={styles.palaceValue}>{String(value)}</Text>
            </View>
          ))}
        </View>
        <View style={{ flex: 1 }}>
          {right.map(([key, value]) => (
            <View key={key} style={styles.palaceItem}>
              <Text style={styles.palaceLabel}>{key}</Text>
              <Text style={styles.palaceValue}>{String(value)}</Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={styles.pageNumber}>2</Text>
    </Page>
  );
}

function BaziPage({ report }: { report: FortuneReport }) {
  if (!report.bazi) return null;
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>八字命盤</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>四柱</Text>
        <View style={styles.row}>
          <View style={styles.col}>
            <View style={styles.card}><Text style={styles.boldLabel}>年柱</Text><Text style={styles.text}>{report.bazi.年柱}</Text></View>
            <View style={styles.card}><Text style={styles.boldLabel}>月柱</Text><Text style={styles.text}>{report.bazi.月柱}</Text></View>
          </View>
          <View style={styles.col}>
            <View style={styles.card}><Text style={styles.boldLabel}>日柱</Text><Text style={styles.text}>{report.bazi.日柱}</Text></View>
            <View style={styles.card}><Text style={styles.boldLabel}>時柱</Text><Text style={styles.text}>{report.bazi.時柱}</Text></View>
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>分析</Text>
        <View style={styles.card}>
          <Text style={styles.boldLabel}>五行分析</Text>
          <Text style={styles.text}>{report.bazi.五行分析}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.boldLabel}>性格特點</Text>
          <Text style={styles.text}>{report.bazi.性格特點}</Text>
        </View>
      </View>
      <Text style={styles.pageNumber}>3</Text>
    </Page>
  );
}

function TarotPage({ report }: { report: FortuneReport }) {
  if (!report.tarot) return null;
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>塔羅占卜</Text>
      <View style={styles.section}>
        <View style={styles.card}>
          <Text style={styles.boldLabel}>牌名</Text>
          <Text style={styles.text}>{report.tarot.card}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.boldLabel}>正逆位</Text>
          <Text style={styles.text}>{report.tarot.position}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.boldLabel}>牌面含義</Text>
          <Text style={styles.text}>{report.tarot.meaning}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.boldLabel}>占卜解讀</Text>
          <Text style={styles.text}>{report.tarot.description}</Text>
        </View>
      </View>
      <Text style={styles.pageNumber}>4</Text>
    </Page>
  );
}

function LifePathPage({ report }: { report: FortuneReport }) {
  if (!report.lifePath) return null;
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>生命靈數</Text>
      <View style={styles.section}>
        <View style={styles.card}>
          <Text style={styles.boldLabel}>靈魂數字</Text>
          <Text style={{ ...styles.text, fontSize: 20, fontWeight: 'bold', color: '#7c3aed', textAlign: 'center', marginVertical: 8 }}>
            {report.lifePath.number}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.boldLabel}>性格描述</Text>
          <Text style={styles.text}>{report.lifePath.description}</Text>
        </View>
        {report.lifePath.strengths && (
          <View style={styles.card}>
            <Text style={styles.boldLabel}>優點</Text>
            <Text style={styles.text}>{report.lifePath.strengths}</Text>
          </View>
        )}
        {report.lifePath.challenges && (
          <View style={styles.card}>
            <Text style={styles.boldLabel}>挑戰</Text>
            <Text style={styles.text}>{report.lifePath.challenges}</Text>
          </View>
        )}
      </View>
      <Text style={styles.pageNumber}>5</Text>
    </Page>
  );
}

function ZodiacPage({ report }: { report: FortuneReport }) {
  if (!report.zodiac) return null;
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>生肖星座</Text>
      <View style={styles.section}>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.boldLabel}>生肖</Text>
              <Text style={styles.text}>{report.zodiac.zodiac}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.boldLabel}>五行</Text>
              <Text style={styles.text}>{report.zodiac.element}</Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.boldLabel}>運勢描述</Text>
          <Text style={styles.text}>{report.zodiac.description}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.boldLabel}>幸運數字</Text>
          <Text style={styles.text}>{report.zodiac.luckyNumbers?.join(', ')}</Text>
        </View>
        {report.zodiac.compatibleSigns && (
          <View style={styles.card}>
            <Text style={styles.boldLabel}>相配星座</Text>
            <Text style={styles.text}>{report.zodiac.compatibleSigns}</Text>
          </View>
        )}
      </View>
      <Text style={styles.footer}>
        此報告由全方位算命網站 AI 自動生成 · 僅供參考
      </Text>
      <Text style={styles.pageNumber}>6</Text>
    </Page>
  );
}

function FortunePDF({ report }: PDFDocumentProps) {
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

interface PDFExportProps {
  report: FortuneReport;
}

export default function PDFExport({ report }: PDFExportProps) {
  return (
    <PDFDownloadLink
      document={<FortunePDF report={report} />}
      fileName={`命理報告-${report.id}.pdf`}
      className="inline-flex items-center gap-2 py-2 px-4 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all"
    >
      {({ loading }) => (loading ? '生成中...' : '📄 匯出 PDF')}
    </PDFDownloadLink>
  );
}
