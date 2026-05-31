import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ResumeData } from '../types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#1a1a1a',
  },
  headerContainer: {
    marginBottom: 15,
    textAlign: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  contactDetails: {
    fontSize: 9,
    color: '#475569',
  },
  sectionContainer: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    borderBottomStyle: 'solid',
    paddingBottom: 2,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 9.5,
    color: '#334155',
    textAlign: 'justify',
  },
  skillsText: {
    fontSize: 9.5,
    color: '#334155',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
    marginTop: 4,
  },
  projectName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  techStack: {
    fontSize: 8.5,
    color: '#475569',
    fontStyle: 'italic',
  },
  bulletContainer: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 8,
  },
  bulletPoint: {
    width: 8,
    fontSize: 9.5,
    color: '#475569',
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#334155',
    textAlign: 'justify',
  },
});

export const ResumePDF = ({ data }: { data: ResumeData }) => {
  // Graceful fallbacks for missing or empty data structure
  const name = data.personalInfo?.name || 'Your Name';
  const email = data.personalInfo?.email || 'email@example.com';
  const phone = data.personalInfo?.phone || '123-456-7890';
  const summary = data.summary || '';
  const skillsList = data.skills || [];
  const projectsList = data.projects || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Block */}
        <View style={styles.headerContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.contactDetails}>
            {email}   |   {phone}
          </Text>
        </View>

        {/* Professional Summary */}
        {summary ? (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        ) : null}

        {/* Technical Skills */}
        {skillsList.length > 0 ? (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skillsText}>{skillsList.join(', ')}</Text>
          </View>
        ) : null}

        {/* Selected Projects */}
        {projectsList.length > 0 ? (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Key Projects</Text>
            {projectsList.map((proj, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>{proj.name}</Text>
                  {proj.techStack && proj.techStack.length > 0 ? (
                    <Text style={styles.techStack}>
                      [{proj.techStack.join(', ')}]
                    </Text>
                  ) : null}
                </View>
                {proj.bullets && proj.bullets.length > 0
                  ? proj.bullets.map((bullet, idx) => (
                      <View key={idx} style={styles.bulletContainer}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))
                  : null}
              </View>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
};
