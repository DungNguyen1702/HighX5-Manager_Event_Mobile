import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import colors from "../../constants/colors";
const api = require("../../repositories/index")

export default function Answer() {
    const route = useRoute();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [user, setUser] = useState({});
    const [question, setQuestion] = useState();
    
    const {event_id , user_id } = route.params;

    useEffect(()=>{
        try {
            const fetchAPI = async()=>{
                const response = await api.form.getAnswerOfEvent(event_id, user_id);
                setData(response)
                setUser(response.Questions[0].Answers[0].User);
                setQuestion(response.Questions);
            }
            fetchAPI();
        } catch (error) {
            console.log(error.message)
        }
        finally{
            setLoading(false);
        }
    },[])

    if (loading)
        return (
        <View style={styles.loadingModal}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Đang lấy dữ liệu   ...</Text>
        </View>
    );

    const navigation = useNavigation();

    const handlerDeny = async()=>{
        const apiDeny = async()=>{
            await api.form.denyForm({
                user_id : user_id,
                event_id : event_id
            }).then((res)=>{
                console.log(res)
                navigation.navigate("EventDetail",{eventId : event_id, userId : user_id})
            })
        }
        apiDeny()
    }

    const handlerAccept = async()=>{
        var department_name = "Ban truyền thông";

        question.forEach((item)=>{
            if(item.question === "Bạn muốn vào phòng ban nào ?")
            {
                department_name = item.Answers[0].answer
            }
        })

        const apiAccept = async()=>{
            await api.form.acceptForm({
                department_name : department_name,
                user_id : user_id,
                event_id : event_id
            }).then((res)=>{
                console.log(res)
                navigation.navigate("EventDetail",{eventId : event_id, userId : user_id})
            })
        }
        apiAccept()
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: colors.background }}
        >
            <View style={styles.container}>
                <Text style={styles.title}>
                    Application from user '{user.name}'
                </Text>
                <View style={styles.userContainer}>
                    <Text style={styles.titleUserInfo}>
                        User's informations
                    </Text>

                    {/* Name */}
                    <View style={styles.littleInfoContainer}>
                        <Text style={styles.label}>Name: </Text>
                        <Text style={styles.info}>{user.name}</Text>
                    </View>

                    {/* email */}
                    <View style={styles.littleInfoContainer}>
                        <Text style={styles.label}>Email: </Text>
                        <Text style={styles.info}>{user.gmail}</Text>
                    </View>

                    {/* telephone */}
                    <View style={styles.littleInfoContainer}>
                        <Text style={styles.label}>Telephone: </Text>
                        <Text style={styles.info}>{user.telephone}</Text>
                    </View>

                    {/* university */}
                    <View style={styles.littleInfoContainer}>
                        <Text style={styles.label}>University: </Text>
                        <Text style={styles.info}>{user.university}</Text>
                    </View>

                    {/* address */}
                    <View style={styles.littleInfoContainer}>
                        <Text style={styles.label}>Address: </Text>
                        <Text style={styles.info}>{user.address}</Text>
                    </View>
                </View>

                {/* answer */}
                <View style={styles.questionContainer}>
                    <Text style={styles.titleUserInfo}>
                        User's answers
                    </Text>
                    {question && question.map((question, index) => {
                        return (
                            <View
                                key={question.id}
                                style={styles.questionSmallContainer}
                            >
                                <Text style={styles.questionTitle}>
                                    {index + 1}. {question.question}
                                </Text>
                                <Text style={styles.answerInput}>
                                    {question.Answers[0].answer}
                                </Text>
                            </View>
                        );
                    })}
                </View>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        paddingHorizontal: 15,
                        flexDirection: "row",
                    }}
                >
                    <TouchableOpacity 
                        style={styles.buttonSubmit}
                        onPress={handlerAccept}
                    >
                        <Text style={styles.buttonText}>Xác nhận</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.buttonDelete}
                        onPress={handlerDeny}
                    >
                        <Text style={styles.buttonText}>Hủy</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        color: colors.primary,
        fontSize: 21,
        textAlign: "center",
        fontWeight: "bold",
        overflow: "scroll",
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    userContainer: {
        backgroundColor: colors.light_gray,
        width: "95%",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        marginHorizontal: 30,
        borderRadius: 6,
        marginVertical: 5,
    },
    titleUserInfo: {
        color: colors.accent,
        fontWeight: "bold",
        fontSize: 20,
        marginVertical: 10,
        textAlign: "center",
    },
    littleInfoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 5,
        alignItems: "center",
        marginVertical: 4,
    },
    label: {
        width: "35%",
        overflow: "scroll",
        paddingLeft: 5,
        fontSize: 15,
        fontWeight: "bold",
        color: colors.secondary,
    },
    info: {
        width: "60%",
        paddingLeft: 10,
        overflow: "scroll",
        fontSize: 15,
        color: colors.text,
    },

    questionContainer: {
        width: "95%",
        marginVertical: 5,
        paddingHorizontal: 20,
        backgroundColor: colors.light_gray,
        borderRadius: 6,
    },
    questionSmallContainer: {
        marginVertical: 10,
        color: colors.accent,
    },
    answerInput: {
        fontSize: 15,
        borderWidth: 1,
        borderRadius: 6,
        borderColor: colors.dark_gray,
        paddingVertical: 10,
        paddingHorizontal: 10,
        color: colors.text,
    },
    questionTitle: {
        fontSize: 15,
        marginBottom: 8,
    },
    buttonSubmit: {
        width: "45%",
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10,
        paddingVertical: 15,
        marginHorizontal: 10,
        borderRadius: 6,
    },
    buttonDelete: {
        width: "45%",
        backgroundColor: colors.danger,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10,
        paddingVertical: 15,
        marginHorizontal: 10,
        borderRadius: 6,
    },
    buttonText: {
        fontSize: 15,
        color: colors.white,
    },
    selection: {
        inputIOS: {
            padding: 12,
            borderWidth: 1,
            borderColor: colors.text,
            borderRadius: 6,
            color: colors.text,
            backgroundColor: "white",
            marginTop: 10,
            marginBottom: 6,
        },
        inputAndroid: {
            padding: 12,
            borderWidth: 1,
            borderColor: colors.text,
            borderRadius: 6,
            color: colors.text,
            backgroundColor: "white",
            marginTop: 10,
            marginBottom: 6,
        },
    },
    loadingModal: {
        position : "absolute",
        width: 200,
        height: 120,
        borderRadius: 20,
        marginTop : 300,
        marginLeft : 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    loadingText: {
        color: "#fff",
        marginTop: 10,
    },
});
