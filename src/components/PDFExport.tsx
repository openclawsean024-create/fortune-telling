'use client';

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { FortuneReport } from '@/types';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#7c3aed' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#4b5563' },
  palaceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  palaceItem: { width: '30%', padding: 10, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 5 },
  palaceLabel: { fontSize: 8, color: '#6b7280' },
  palaceValue: { fontSize: 12, fontWeight: 'bold', color: '#7c3aed' },
  card: { padding: 10, backgroundColor: '#f9fafb', borderRadius: 5, marginBottom: 10 },
  text: { fontSize: 10, color: '#374151', marginBottom: 4 },
  row: { flexDirection: 'row', gap: 10 },
  col: { flex: 1 },
});

interface PDFDocumentProps {
  report: FortuneReport;
}

function FortunePDF({ report }: PDFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>全方位命理分析報告</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>基本資料</Text>
          <View style={styles.card}>
            <Text style={styles.text}>姓名：{report.birthInfo.name || '未提供'}</Text>
            <Text style={styles.text}>出生日期：{report.birthInfo.birthDate} {report.birthInfo.birthTime}</Text>
            <Text style={styles.text}>類型：{report.birthInfo.isLunar ? '農曆' : '國曆'}</Text>
            <Text style={styles.text}>生成時間：{new Date(report.createdAt).toLocaleString('zh-TW')}</Text>
          </View>
        </View>

        {report.ziwu && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>紫微斗數命盤</Text>
            <View style={styles.palaceGrid}>
              {Object.entries(report.ziwu).slice(0, 12).map(([key, value]) => (
                <View key={key} style={styles.palaceItem}>
                  <Text style={styles.palaceLabel}>{key}</Text>
                  <Text style={styles.palaceValue}>{String(value)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {report.bazi && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>八字命盤</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <View style={styles.card}><Text style={styles.text}>年柱：{report.bazi.年柱}</Text></View>
                <View style={styles.card}><Text style={styles.text}>月柱：{report.bazi.月柱}</Text></View>
              </View>
              <View style={styles.col}>
                <View style={styles.card}><Text style={styles.text}>日柱：{report.bazi.日柱}</Text></View>
                <View style={styles.card}><Text style={styles.text}>時柱：{report.bazi.時柱}</Text></View>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.text}>五行分析：{report.bazi.五行分析}</Text>
              <Text style={styles.text}>性格特點：{report.bazi.性格特點}</Text>
            </View>
          </View>
        )}

        {report.lifePath && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>生命靈數</Text>
            <View style={styles.card}>
              <Text style={styles.text}>靈魂數字：{report.lifePath.number}</Text>
              <Text style={styles.text}>{report.lifePath.description}</Text>
            </View>
          </View>
        )}

        {report.zodiac && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>生肖星座</Text>
            <View style={styles.card}>
              <Text style={styles.text}>生肖：{report.zodiac.zodiac} | 五行：{report.zodiac.element}</Text>
              <Text style={styles.text}>{report.zodiac.description}</Text>
              <Text style={styles.text}>幸運數字：{report.zodiac.luckyNumbers.join(', ')}</Text>
            </View>
          </View>
        )}
      </Page>
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