export const setAllUsersDetails = (data)=>{
    return{
        type:'SET_ALL_USERS',
        allUsers:data,
    };
};

export const getAllUsersDetails = (data)=>{
    return{
        type:'GET_ALL_USERS',
    };
};
