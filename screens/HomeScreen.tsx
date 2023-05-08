import { useState } from 'react'
import { Button, Text, View, ScrollView } from 'react-native'
import useSWR from 'swr'

import { getNatureLogs } from '../lib/firebase'

export default function HomeScreen() {
  const [key, setKey] = useState(0)
  const { data, error, isLoading } = useSWR(['nature_log', 10], ([_, limit]) =>
    getNatureLogs(limit)
  )

  if (error) {
    return (
      <View>
        <Text>Failed to load</Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView key={`key-${key}`}>
      <Text>Home</Text>
      {data?.map(({ te, created_at }) => {
        return <Text key={created_at.toString()}>{te.val}</Text>
      })}
      {/* TODO: 表示更新用（仮） */}
      <Button title="Refresh" onPress={() => setKey((prev) => prev + 1)} />
    </ScrollView>
  )
}
