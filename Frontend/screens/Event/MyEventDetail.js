import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Animated, ActivityIndicator } from 'react-native'
import { event as EventRepository } from '../../repositories'
import formatDateTime from '../../utils/helpers/formatDate'
import icons from '../../constants/icons'
import colors from '../../constants/colors'
import {startSpinner, spinValue} from '../../utils/helpers/startSpinner'
import { useNavigation } from '@react-navigation/native'

const MyEventDetail = (props) => {
    const [event, setEvent] = useState({})
    const [departments, setDepartments] = useState([])
    const [showMembers, setShowMembers] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState(null)
    const [loading, setLoading] = useState(true)

    const {loadingAPI , eventId } = props.route.params

    useEffect(() => {
        startSpinner()

        EventRepository.getEventDetail(eventId)
            .then((responseEvent) => {
                setEvent(responseEvent.queryResult)
                setDepartments(responseEvent.queryResult.Departments)
            })
            .catch((error) => {
                throw error
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
    }, [loadingAPI])
    
    const navigation = useNavigation()
    const handleEditEvent = (eventId, eventName) => {
        navigation.navigate('EditEvent', { eventId, eventName, loadingAPI : true })
    }

    const handleApply = () => {
        navigation.navigate('ListUserApply', {event_id: event.id})
    }

    const handleDelete = async () => {
        await EventRepository.deleteEvent(event.id)
        navigation.navigate('MyEvent' , {userId: props.route.params.userId})
    }
    
    const handleTask = async () => {
        navigation.navigate('EventTask', {eventId: event.id, userId: props.route.params.userId})
    }

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <>
                    <Image source={{ uri: event.image }} style={styles.image} />
                    <View style={styles.contentContainer}>
                        <View style={styles.infor}>
                            <Text style={styles.name}>{event.name}</Text>
                            <Text style={styles.slogan}>{event.slogan}</Text>
                            <Text style={{
                                backgroundColor: event.status == 0 ? colors.warning : event.status == 1 ? colors.success : colors.danger,
                                fontWeight: '700',
                                color: colors.white,
                                width: 90,
                                textAlign: 'center',
                                borderRadius: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: 16,
                                marginVertical: 10
                            }}>
                                {event.status == 0 ? 'Upcoming' : event.status == 1 ? 'On going' : 'Completed'}
                            </Text>
                            <View style={styles.action}>
                                <TouchableOpacity 
                                    style={[styles.btn, {backgroundColor: colors.danger}]}
                                    onPress={handleDelete}
                                >
                                    <Text style={styles.textBtn}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.btn, {backgroundColor: colors.warning}]} 
                                    onPress={() => {handleEditEvent(event.id, event.name)}}
                                >
                                    <Text style={styles.textBtn}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn, {backgroundColor: colors.success}]} onPress={handleTask}>
                                    <Text style={styles.textBtn}>Task</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn, {backgroundColor: colors.primary}]} onPress={handleApply} >
                                    <Text style={styles.textBtn}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Date time */}
                        <Text style={styles.title}>Date</Text>
                        <View style={styles.item}>
                            <Text style={styles.textInfor}>{formatDateTime(event.date_start)} - {formatDateTime(event.date_end)}</Text>
                        </View>

                        {/* Location */}
                        <Text style={styles.title}>Location</Text>
                        <View style={styles.item}>
                            <Text style={styles.textInfor}>{event.location}</Text>
                        </View>

                        {/* Description */}
                        <Text style={styles.title}>Description</Text>
                        <View style={styles.item}>
                            <Text style={styles.textInfor}>{event.description}</Text>
                        </View>

                        {/* Department */}
                        {departments.map((department, index) => (
                            <View key={index} style={styles.item}>
                                <TouchableOpacity onPress={() => toggleMembers(index)}>
                                    <Text style={styles.title}>{department.name}</Text>
                                    <Text style={styles.textInfor}>{department.description}</Text>
                                    <Text
                                        style={{
                                            fontWeight: '500',
                                            color: colors.secondary,
                                            textAlign: 'right',
                                            marginBottom: 10,
                                        }}
                                    >
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        <View style={{ height: 200 }}></View>
                    </View>
                </>
            )}

        </ScrollView>
    )
}

export default MyEventDetail

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    contentContainer: {
        borderRadius: 10,
        marginTop: -10,
        backgroundColor: colors.white,
        padding: 16,
    },
    image: {
        width: '100%',
        height: 300
    },
    name: {
        fontSize: 30,
        fontWeight: '600',
        color: colors.accent
    },
    slogan: {
        fontSize: 20,
        color: colors.text,
        marginVertical: 2,
        fontWeight: '600'
    },
    icon: {
        height: 26,
        width: 26,
        tintColor: colors.text,
        marginRight: 4
    },
    title: {
        fontWeight: '600',
        fontSize: 20,
        marginBottom: 8,
        color: colors.secondary
    },
    item: {
        borderColor: colors.dark_gray,
        borderBottomWidth: 0.5,
        marginTop: 6,
        marginBottom: 10,
        paddingBottom: 10
    },
    subTitle: {
        fontWeight: '600'
    },
    textInfor: {
        color: colors.text,
        fontSize: 17,
        textAlign: 'justify'
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    action: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingVertical: 20
    },
    btn: {
        width: '25%',
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textBtn: {
        color: colors.white,
        fontSize: 17,
    }
})
