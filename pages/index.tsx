import { Card, Title, AreaChart, Metric, Flex, Grid, ProgressBar } from '@tremor/react'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '@/lib/prisma'
import { DashboardProps } from '@/typings/types'
import { customParseJSON } from '@/lib/utils'

export const getServerSideProps: GetServerSideProps<DashboardProps> = async (context) => {
  const session = await getSession(context)
  if (!session?.user) {
    return { redirect: { destination: '/login', permanent: false } }
  }

  // Vehicle statistics
  const totalVehicles = await prisma.vehicle.count({
    where: { userId: session.user.id },
  })

  const today = new Date()
  const startOfToday = new Date(today.setHours(0, 0, 0, 0))

  const todaysVehicles = await prisma.vehicle.count({
    where: {
      userId: session.user.id,
      createdAt: { gte: startOfToday }
    }
  })

  // Offense type distribution
  const offenseDistribution = await prisma.vehicle.groupBy({
    by: ['offenseType'],
    _count: { _all: true },
    where: { userId: session.user.id }
  })

  // Daily activity (last 7 days)
  const dailyActivity = await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('day', "createdAt") as day,
      COUNT(*) as count
    FROM "Vehicle"
    WHERE "userId" = ${session.user.id}
      AND "createdAt" >= NOW() - INTERVAL '7 days'
    GROUP BY day
    ORDER BY day ASC
  `

  return {
    props: {
      stats: {
        totalVehicles,
        todaysVehicles,
        offenseDistribution,
        dailyActivity: customParseJSON(dailyActivity.map((entry: any) => ({
          day: new Date(entry.day),
          count: Number(entry.count)
        })))
      }
    }
  }
}

const DashboardPage: React.FC<DashboardProps> = ({ stats }) => {
  console.log('stats', stats)
  const formattedDailyData = stats.dailyActivity.map(entry => ({
    date: new Date(entry.day).toLocaleDateString('pt-BR'),
    Vehicles: entry.count,
  }))

  return (
    <div className="p-6">
      <Title>Dashboard Overview</Title>

      <Grid numColsSm={2} numColsLg={3} className="gap-6 mt-6">
        <Card>
          <Flex justifyContent="between" alignItems="center">
            <Title>Total Vehicles</Title>
            <Metric>{stats.totalVehicles}</Metric>
          </Flex>
          <ProgressBar value={stats.todaysVehicles} maxValue={stats.totalVehicles} className="mt-2" />
          <div className="mt-2 text-sm text-gray-500">
            {stats.todaysVehicles} registered today
          </div>
        </Card>

        <Card>
          <Title>Offense Distribution</Title>
          {stats.offenseDistribution.map((item) => (
            <Flex key={item.type} className="mt-4">
              <div className="truncate">{item.type}</div>
              <Metric>{item.count}</Metric>
            </Flex>
          ))}
        </Card>

        <Card>
          <Title>Daily Activity (7 days)</Title>
          <AreaChart
            className="mt-4 h-48"
            data={formattedDailyData}
            categories={['Vehicles']}
            index="date"
            colors={['blue']}
            showLegend={false}
            curveType="monotone"
          />
        </Card>
      </Grid>

      <Card className="mt-6">
        <Title>Recent Vehicles</Title>
        {/* Add recent vehicles table here */}
      </Card>
    </div>
  )
}

export default DashboardPage