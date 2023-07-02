import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { getInstructorData } from '../../../../services/operations/profileAPI';
import InstructorChart from './InstructorChart';
import { Link } from 'react-router-dom';

const Instructor = () => {
    const {token} = useSelector((state)=> state.auth);
    const {user} = useSelector((state)=>state.profile);
    const [loading, setLoading] = useState(false);
    const [instructorData, setInstructorData] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(()=> {
        const getCourseDataWithStats = async() => {
            setLoading(true);
            
            const instructorApiData = await getInstructorData(token);
            const result = await fetchInstructorCourses(token);

            console.log(instructorApiData);

            if(instructorApiData.length)
                setInstructorData(instructorApiData);

            if(result) {
                setCourses(result);
            }
            setLoading(false);
        }
        getCourseDataWithStats();
    },[])

    const totalAmount = instructorData?.reduce((acc,curr)=> acc + curr.totalAmountGenerated, 0);
    const totalStudents = instructorData?.reduce((acc,curr)=>acc + curr.totalStudentsEnrolled, 0);

  return (
    <div className='text-white'>
      <div >
        <h1 className='font-bold text-2xl'>Hi {user?.firstName}</h1>
        <p>Let's start something new</p>
      </div>

      {loading ? (<div className='spinner'></div>)
      :courses.length > 0 
        ? (<div>
            <div>
            <div className='flex mt-10 justify-between gap-5 h-[30%] '>
                <InstructorChart className="h-[30%]" courses={instructorData}/>
                <div className='bg-richblack-500 p-4 w-3/12 flex flex-col gap-5'>
                    <p className='font-bold'>Statistics</p>
                    <div>
                        <p>Total Courses</p>
                        <p className='font-bold'>{courses.length}</p>
                    </div>

                    <div>
                        <p>Total Students</p>
                        <p className='font-bold'>{totalStudents}</p>
                    </div>

                    <div>
                        <p>Total Income</p>
                        <p className='font-bold'>{totalAmount}</p>
                    </div>
                </div>
            </div>
        </div>
        <div className='h-[50%] mt-9 bg-richblack-500 p-5'>
            {/* Render 3 courses */}
            <div className='flex justify-between mb-5'>
                <p className='font-bold'>Your Courses</p>
                <Link className=' hover:text-yellow-50' to="/dashboard/my-courses" >
                    <p>View all</p>
                </Link>
            </div>
            <div className='flex gap-5'>
                {
                    courses.slice(0,3).map((course)=> (
                        <div>
                            <img className='w-[500px] h-[200px]'
                                src={course.thumbnail}
                            />
                            <div>
                                <p className='font-bold'>{course.courseName}</p>
                                <div className='flex gap-5'>
                                    <p>{course.studentsEnrolled.length} students</p>
                                    <p> | </p>
                                    <p> Rs {course.price}</p>
                                </div>

                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
        </div>
        
        )
        :(<div>
            <p>You have not created any courses yet</p>
            <Link to={"/dashboard/addCourse"}>
                Create a Course
            </Link>
        </div>)}
    </div>
  )
}

export default Instructor
