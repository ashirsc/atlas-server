

const allowedUsers = [
    "+12063343694"
]
export const isSubscribed = (userId:string) => { 
    return allowedUsers.findIndex(id => id === userId) > -1

 }