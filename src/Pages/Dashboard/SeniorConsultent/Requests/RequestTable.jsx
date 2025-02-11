
import { Button, CardBody, CardFooter, Chip, IconButton, Typography } from '@material-tailwind/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import Loader from '../../../../Components/Shared/Loader';
import { api } from '../../../../Components/axios/axios.instance';
import toast from 'react-hot-toast';

const TABLE_HEAD = ["User id", "U. Name", "U. Whatsapp", "R. ID", "R. Name", "R. Whatsapp", "Action"];

const Requesttable = ({ }) => {

    const { isLoading, data: users, refetch } = useQuery({
        queryKey: ["requests"],
        queryFn: async () => {
            const passbook = await api.get(`/requests/all`);
            return passbook.data
        }
    })
    const handleRequest = async (id, type) => {
        try {
            const res = await api.put(`/requests/a-r`, { type, id });
            if (res) {
                refetch()
                toast.success("Request updated successfully");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }
    if (isLoading) {
        return <Loader />
    }
    return (
        <React.Fragment>
            <CardBody className="overflow-scroll px-0">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th
                                    key={head}
                                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map(
                            (
                                { user, requester, _id, status },
                                index,
                            ) => {
                                const isLast = index === users.length - 1;
                                const classes = isLast
                                    ? "p-4"
                                    : "p-4 border-b border-blue-gray-50";

                                return (
                                    <tr key={index} >

                                        <td className={classes}>
                                            <div className="flex items-center gap-3">

                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-bold"
                                                >
                                                    {user?.userId}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {user?.firstName + " " + user?.lastName}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal opacity-70 text-xs"
                                                    >
                                                        {user?.phone}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal opacity-70 text-xs"
                                                    >
                                                        {requester?.userId}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal opacity-70 text-xs"
                                                    >
                                                        {requester?.firstName + " " + requester?.lastName}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex items-center gap-3">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal opacity-70 text-xs"
                                                >
                                                    {requester?.whatsapp}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            {
                                                status === "pending" ?
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleRequest(_id, "accept")}
                                                            className='btn btn-xs btn-primary'>
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleRequest(_id, "reject")}
                                                            className='btn btn-xs btn-error text-white'>
                                                            Reject
                                                        </button>
                                                    </div>
                                                    :
                                                    <div className="flex">
                                                        {
                                                            status === "accepted" &&
                                                            <button
                                                                className='btn btn-xs btn-success bg-green-500 text-white border-none'>
                                                                Accepted
                                                            </button>
                                                        }
                                                        {
                                                            status === "rejected" &&
                                                            <button
                                                                className='btn btn-xs btn-error text-white'>
                                                                Rejected
                                                            </button>
                                                        }
                                                    </div>
                                            }
                                        </td>
                                    </tr>
                                );
                            },
                        )}
                    </tbody>
                </table>
            </CardBody>
        </React.Fragment>

    );
};

export default Requesttable;