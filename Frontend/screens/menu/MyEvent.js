import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Animated, ActivityIndicator, Image, TouchableOpacity } from 'react-native'
import { SectionGrid } from 'react-native-super-grid'
import { event as EventRepository } from '../../repositories'
import { startSpinner, spinValue } from '../../utils/helpers/startSpinner'
import colors from '../../constants/colors'
import { useNavigation } from '@react-navigation/native'

export default function MyEvent({route}) {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    const navigation = useNavigation()

    const {userId} = route.params

    useEffect(() => {
        startSpinner()
        EventRepository.getEventByUserId(userId)
            .then((responseEvents) => {
                setEvents(responseEvents.rows)
            })
            .catch((error) => {
                console.error('Error fetching events:', error)
            })
            .finally(() => {
                setLoading(false)
                Animated.loop(
                    Animated.timing(spinValue, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: true,
                    })
                ).stop()
            })
    }, [])

    const handleEventDetail = (eventId, eventName) => {
        navigation.navigate('MyEventDetail', { eventId, eventName, userId: route.params.userId})
    }

    const RenderItem = ({ item, index }) => (
        <View style={styles.itemContainer}>
            <View style={{padding: 8}}>
                <Image source={{uri: item.image}} style={styles.image}/>
            </View>
            <View style={styles.infor}>
                <View>
                    <Text style={styles.name}>
                        {item.name.length > 16 ? item.name.substring(0, 16) + '...' : item.name}
                    </Text>
                    <Text style={styles.slogan}>
                        {item.slogan ? item.slogan.length > 18 ? item.slogan.substring(0, 18) + '...' : item.slogan : ''}
                    </Text>
                </View>
                <TouchableOpacity style={styles.btn} onPress={ () => {handleEventDetail(item.id,item.name)}}>
                    <Text style={styles.textBtn}>Read more</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        )
    }

    return (
        <SectionGrid
            itemDimension={150}
            sections={[
                {
                    data: events,
                },
            ]}
            style={styles.gridView}
            renderItem={({ item, index }) => <RenderItem item={item} index={index} />}
            numColumns={2}
        />
    )
}

const styles = StyleSheet.create({
    gridView: {
        flex: 1,
    },
    itemContainer: {
        width: '100%',
        backgroundColor: colors.white,
        borderRadius: 8,
        borderWidth: 0.4,
        borderColor: colors.dark_gray
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        borderWidth: 0.4,
        borderColor: colors.dark_gray,
    },
    infor: {
        height: 100,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.accent
    },
    slogan: {
        fontSize: 15,
        color: colors.text
    },
    action: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        backgroundColor: colors.primary,
        width: '100%',
        borderRadius: 2,
        padding: 6,
        marginTop: 10
    },
    textBtn: {
        fontSize: 15,
        textAlign: 'center',
        color: colors.white
    }
})
