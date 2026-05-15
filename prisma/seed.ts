import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@oncoai.com' },
    update: {},
    create: { email: 'admin@oncoai.com', passwordHash: adminPassword, role: 'ADMIN' },
  })
  console.log('✅ Admin:', admin.email)

  const doctorPassword = await bcrypt.hash('doctor123', 10)
  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@oncoai.com' },
    update: {},
    create: {
      email: 'doctor@oncoai.com', passwordHash: doctorPassword, role: 'DOCTOR',
      doctorProfile: {
        create: { firstName: 'Sarah', lastName: 'Connor', specialization: 'Breast Oncology', licenseNumber: 'ONC-12345' }
      }
    },
    include: { doctorProfile: true }
  })
  console.log('✅ Doctor:', doctor.email)

  const patientPassword = await bcrypt.hash('patient123', 10)
  const patient = await prisma.user.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: {
      email: 'patient@example.com', passwordHash: patientPassword, role: 'PATIENT',
      patientProfile: {
        create: {
          firstName: 'Jane', lastName: 'Doe', dateOfBirth: new Date('1980-06-15'),
          assignedDoctorId: doctor.doctorProfile?.id,
          consentRecord: { create: { agreedToTerms: true, agreedToDataUse: true, ipAddress: '127.0.0.1' } },
          documents: {
            create: [
              { fileName: 'Mammogram_Report_2024.pdf', fileUrl: '/uploads/demo1.pdf', fileType: 'application/pdf', fileSize: 1024000 },
              { fileName: 'Biopsy_Pathology_Results.pdf', fileUrl: '/uploads/demo2.pdf', fileType: 'application/pdf', fileSize: 512000 },
              { fileName: 'MRI_Scan_Breast.jpg', fileUrl: '/uploads/demo3.jpg', fileType: 'image/jpeg', fileSize: 2048000 },
            ]
          },
          queries: {
            create: [
              {
                subject: 'Regarding Stage 2 Diagnosis',
                encryptedMessage: 'My oncologist diagnosed me with Stage 2 invasive ductal carcinoma. I wanted to get a second opinion on the recommended treatment plan.',
                status: 'ANSWERED',
                responses: {
                  create: [{
                    doctorId: doctor.doctorProfile!.id,
                    encryptedMessage: 'Thank you for sharing your case with me. Based on the pathology report you uploaded, the diagnosis appears consistent. I recommend we discuss a modified treatment plan that includes targeted therapy alongside the proposed chemotherapy. Let me review the MRI scan as well.',
                  }]
                }
              },
              {
                subject: 'Side effects of Tamoxifen',
                encryptedMessage: 'I have been prescribed Tamoxifen for hormone therapy. Can you explain the potential side effects and how to manage them?',
                status: 'PENDING',
              }
            ]
          },
          aiReports: {
            create: [
              {
                summary: 'Preliminary AI analysis indicates Stage 2A invasive ductal carcinoma based on uploaded imaging and pathology reports.',
                riskLevel: 'HIGH',
                findings: 'The AI model analyzed the uploaded mammogram and biopsy results. Key findings: 1.8cm mass in upper outer quadrant of left breast, ER/PR positive, HER2 negative. No lymph node involvement detected in the MRI scan.',
                recommendations: '1. Hormone therapy (Tamoxifen or aromatase inhibitor) is strongly indicated given ER/PR positive status.\n2. Consider lumpectomy with sentinel lymph node biopsy.\n3. Follow-up MRI in 3 months post-treatment.\n4. Genetic counseling for BRCA1/2 mutation screening.',
                status: 'READY',
              }
            ]
          },
          appointments: {
            create: [
              {
                doctorId: doctor.doctorProfile!.id,
                scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                type: 'VIDEO',
                status: 'SCHEDULED',
                notes: 'Initial second opinion consultation – please have all reports ready.',
              },
              {
                doctorId: doctor.doctorProfile!.id,
                scheduledAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
                type: 'IN_PERSON',
                status: 'SCHEDULED',
                notes: 'Follow-up after AI report review.',
              },
            ]
          }
        }
      }
    },
    include: { patientProfile: true }
  })
  console.log('✅ Patient:', patient.email)
  console.log('\n🌱 Seeding complete.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
