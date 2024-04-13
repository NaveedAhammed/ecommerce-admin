import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Table, {
	TBody,
	THead,
	THeadData,
	TRow,
	TRowData,
} from "../components/Table";
import TableAction from "../components/TableAction";
import { useAppDispatch, useAppSelector } from "../redux/store";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import dayjs from "dayjs";
import Button from "../components/Button";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../components/Loader";
import { errorHandler } from "../utils/errorHandler";
import { UserType } from "../types";
import {
	removeUser,
	setIsUserModalOpen,
	setPageNum,
	setUserData,
	setUserEditMode,
	setUsers,
} from "../redux/slices/userSlice";
import ControlledInput from "../components/ControlledInput";

const Users = () => {
	const { users, pageNum, usersPerPage, totalUsers } = useAppSelector(
		(state) => state.users
	);
	const [filterQuery, setFilterQuery] = useState<string>("");

	const filteredUsers = users
		.slice(
			(pageNum - 1) * usersPerPage,
			(pageNum - 1) * usersPerPage + usersPerPage
		)
		.filter((user) =>
			user.username.toLowerCase().includes(filterQuery.toLowerCase())
		);
	const [isLoading, setIsLoading] = useState(false);

	const axiosPrivate = useAxiosPrivate();

	const dispatch = useAppDispatch();

	const handleActionEdit = (data: UserType) => {
		dispatch(setUserEditMode(true));
		dispatch(setUserData(data));
		dispatch(setIsUserModalOpen(true));
	};

	const handleActionDelete = (user: UserType) => {
		const res = axiosPrivate.delete(`/user/delete/${user._id}`);
		toast.promise(res, {
			loading: `Deleting the user ${user._id}`,
			success: () => {
				dispatch(removeUser(user._id));
				return "Deleted successfully";
			},
			error: (err) => {
				if (axios.isAxiosError<{ message: string }>(err)) {
					if (!err?.response) {
						return "Something went wrong";
					} else {
						return `${err.response?.data?.message}`;
					}
				}
				return "Unexpected error!";
			},
		});
	};

	const handlePagination = (dir: string) => {
		dispatch(setUsers({ products: [] }));
		if (dir === "previous") {
			dispatch(setPageNum(pageNum - 1));
		} else {
			dispatch(setPageNum(pageNum + 1));
		}
	};

	useEffect(() => {
		const fetchUsers = () => {
			setIsLoading(true);
			axiosPrivate
				.get(`/users?page=${pageNum}`)
				.then((res) => {
					dispatch(
						setUsers({
							users: res.data.data.users,
							totalUsers: res.data.data.totalUsers,
						})
					);
				})
				.catch(errorHandler)
				.finally(() => {
					setIsLoading(false);
				});
		};

		users.length === 0 && fetchUsers();
	}, [axiosPrivate, dispatch, pageNum, users]);

	return (
		<div className="w-full h-full">
			<Heading
				title="Users"
				description="Manage users of your store"
				action={() => dispatch(setIsUserModalOpen(true))}
				actionLabel="Add New"
				actionLabelNotRequired
			/>
			<div className="flex items-center gap-4 w-full mb-4">
				<ControlledInput
					autoComplete="off"
					name="searchQuery"
					type="text"
					placeholder="Search"
					className="max-w-[30rem]"
					id="searchQuery"
					value={filterQuery}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setFilterQuery(e.target.value)
					}
				/>
				{filterQuery && (
					<Button
						varient="default"
						size="default"
						onClick={() => setFilterQuery("")}
					>
						Reset
					</Button>
				)}
			</div>
			<Table>
				<THead>
					<TRow>
						<THeadData>User ID</THeadData>
						<THeadData>Username</THeadData>
						<THeadData>Email</THeadData>
						<THeadData>Gender</THeadData>
						<THeadData>Phone</THeadData>
						<THeadData>Role</THeadData>
						<THeadData>CreatedAt</THeadData>
						<THeadData>Action</THeadData>
					</TRow>
				</THead>
				{isLoading && (
					<tbody className="relative">
						<tr>
							<td className="h-16">
								<Loader
									color="black"
									height="2rem"
									width="2rem"
									className="absolute top-4 left-[50%]"
								/>
							</td>
						</tr>
					</tbody>
				)}
				{filteredUsers?.length > 0 && (
					<TBody>
						{filteredUsers?.map((user) => (
							<TRow key={user._id}>
								<TRowData>{user._id.slice(0, 15)}...</TRowData>
								<TRowData>{user.username}</TRowData>
								<TRowData>{user.email}</TRowData>
								<TRowData>
									{user?.gender ? `${user.gender}` : "--"}
								</TRowData>
								<TRowData>
									{user?.phone ? `${user.phone}` : "--"}
								</TRowData>
								<TRowData>
									<div
										className={`w-fit px-2 py-1 text-xs rounded-md flex items-center justify-center  ${
											user.role === "admin"
												? "bg-green-600/20 text-green-600"
												: "text-blue bg-blue/20"
										}`}
									>
										{user.role}
									</div>
								</TRowData>
								<TRowData>
									{dayjs(
										user?.createdAt?.split("T")[0]
									).format("MMM D, YYYY")}
								</TRowData>
								<TableAction
									onDelete={() => handleActionDelete(user)}
									onEdit={() => handleActionEdit(user)}
								/>
							</TRow>
						))}
					</TBody>
				)}
			</Table>
			<div className="w-full flex items-center p-4 justify-end gap-3">
				<Button
					varient="outline"
					size="sm"
					onClick={() => handlePagination("previous")}
					disabled={pageNum === 1 || isLoading}
				>
					Previous
				</Button>
				<span>{pageNum}</span>
				<Button
					varient="outline"
					size="sm"
					onClick={() => handlePagination("next")}
					disabled={
						totalUsers
							? pageNum >= Math.ceil(totalUsers / usersPerPage)
							: isLoading
					}
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export default Users;
