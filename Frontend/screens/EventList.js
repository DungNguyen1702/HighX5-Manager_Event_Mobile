import {
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import colors from '../constants/colors';
import EventItem from '../components/EventItem';
import icons from '../constants/icons';
import { isIOS } from '../utils/helpers/Device';
import { event as EventRepository } from '../repositories';
import { useSafeArea } from '../utils/helpers/Device';
import { useNavigation } from '@react-navigation/native';

export default function EventList() {
    const [events, setEvents] = useState([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        EventRepository.getEvents()
            .then((responseEvents) => {
                setEvents(responseEvents);
            })
            .catch((error) => {
                throw error;
            });
    }, []);

    const filterEvent = events.filter((eachEvent) => eachEvent.name.toLowerCase().includes(searchText.toLowerCase()));

    const navigation = useNavigation();

    const handleEventDetail = () => {
        navigation.navigate('EventDetail');
    };

    return (
        <View style={[styles.container, { paddingTop: useSafeArea() }]}>
            <View style={styles.top}>
                <Image source={icons.search} style={styles.search} />
                <TextInput
                    style={styles.input}
                    placeholder="Search"
                    onChangeText={(text) => {
                        setSearchText(text);
                    }}
                />
                <TouchableOpacity
                    onPress={() => {
                        alert('Filter');
                    }}
                >
                    <Image source={icons.filter} style={styles.filter} />
                </TouchableOpacity>
            </View>
            {filterEvent.length > 0 ? (
                <FlatList
                    data={filterEvent}
                    renderItem={({ item }) => <EventItem event={item} key={item.id} onPress={handleEventDetail} />}
                    keyExtractor={(eachEvent) => eachEvent.id}
                />
            ) : (
                <View style={styles.notFound}>
                    <Image style={styles.iconNotFound} source={icons.smartphone} />
                    <Text style={styles.textNotFound}>Event not found !!!</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    top: {
        height: 54,
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 6,
        paddingHorizontal: 10,
        position: 'relative',
    },
    search: {
        zIndex: 1,
        height: 30,
        width: 30,
        position: 'absolute',
        left: 14,
        tintColor: colors.subText,
    },
    input: {
        backgroundColor: colors.light_gray,
        flex: 1,
        fontSize: 18,
        paddingVertical: 10,
        paddingStart: 40,
        borderRadius: 10,
    },
    filter: {
        zIndex: 4,
        height: 24,
        width: 24,
        marginHorizontal: 4,
        tintColor: colors.subText,
    },
    notFound: {
        flex: 1,
        marginTop: 150,
        alignItems: 'center',
    },
    iconNotFound: {
        width: 120,
        height: 120,
    },
    textNotFound: {
        marginTop: 10,
        color: colors.accent,
        fontSize: 16,
    },
});
