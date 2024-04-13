import { createSlice } from "@reduxjs/toolkit";
import { UserType } from "../../types";

interface UsersState {
	users: UserType[];
	isUserModalOpen: boolean;
	userData: UserType | null;
	editMode: boolean;
	pageNum: number;
	usersPerPage: number;
	totalUsers?: number;
}

const initialState: UsersState = {
	users: [],
	isUserModalOpen: false,
	userData: null,
	editMode: false,
	pageNum: 1,
	usersPerPage: 10,
	totalUsers: 10,
};

const userSlice = createSlice({
	name: "customer",
	initialState,
	reducers: {
		setUsers(state, action) {
			state.users = action.payload.users;
			state.totalUsers = action.payload?.totalUsers;
		},
		removeUser(state, action) {
			state.users = state.users.filter(
				(user) => user._id !== action.payload
			);
		},
		setPageNum(state, action) {
			state.pageNum = action.payload;
		},
		updateUser(state, action) {
			const indexOfProduct = state.users.findIndex(
				(user) => user._id === action.payload.order._id
			);
			state.users[indexOfProduct] = action.payload.user;
			state.totalUsers = action.payload.totalUsers;
		},
		setUserEditMode(state, action) {
			state.editMode = action.payload;
		},
		setUserData(state, action) {
			state.userData = action.payload;
		},
		setIsUserModalOpen(state, action) {
			state.isUserModalOpen = action.payload;
		},
		addNewUser(state, action) {
			state.users.push(action.payload);
		},
		setTotalUsers(state, action) {
			state.totalUsers = action.payload;
		},
	},
});

export const {
	addNewUser,
	removeUser,
	setIsUserModalOpen,
	setTotalUsers,
	setUserData,
	setUserEditMode,
	setUsers,
	updateUser,
	setPageNum,
} = userSlice.actions;

export default userSlice.reducer;
