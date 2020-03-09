export default [
    {
        path: '/user', component: '../layouts/UserLayout',
        title: 'route.user',
        routes: [
            {
                path: '/user/login',
                component: './User/Login',
                title: 'route.user.login'
            },
            {
                redirect: '/error/404'
            }
        ]
    },
    {
        path: '/error', component: '../layouts/ErrorLayout',
        title: 'route.error',
        routes: [
            {
                path: '/error/404',
                title: 'route.error.404',
                component: './Error/404'
            },
            {
                path: '/error/403',
                title: 'route.error.403',
                component: './Error/403'
            },
            {
                path: '/error/500',
                title: 'route.error.500',
                component: './Error/500'
            },
            {
                redirect: '/error/404'
            }
        ]
    },
    {
        path: '/course/:courseId',
        title: 'route.course',
        Routes: ['./src/routes/Authenticated', './src/routes/ValidCourse'],
        routes: [
            {
                path: '/course/:courseId/edit',
                title: 'route.course.edit',
                component: '../layouts/CourseLayouts/EditLayout',
                routes: [
                    {
                        path: '/course/:courseId/edit/history',
                        title: 'route.course.edit.history',
                        component: './Course/Edit/History'
                    },
                    {
                        path: '/course/:courseId/edit/goals',
                        title: 'route.course.edit.goals',
                        component: './Course/Edit/Goals'
                    },
                    {
                        path: '/course/:courseId/edit/course-structure',
                        title: 'route.course.edit.coursestructure',
                        component: './Course/Edit/CourseStructure'
                    },
                    {
                        path: '/course/:courseId/edit/setup-test',
                        title: 'route.course.edit.setuptest',
                        component: './Course/Edit/SetupTest'
                    },
                    {
                        path: '/course/:courseId/edit/film-edit',
                        title: 'route.course.edit.filmedit',
                        component: './Course/Edit/FilmEdit'
                    },
                    {
                        path: '/course/:courseId/edit/syllabus',
                        title: 'route.course.edit.syllabus',
                        component: './Course/Edit/Syllabus'
                    },
                    {
                        path: '/course/:courseId/edit/lecture/video/:lectureId',
                        title: 'route.course.edit.lecture',
                        component: './Course/Edit/VideoLecture'
                    },
                    {
                        path: '/course/:courseId/edit/lecture/article/:lectureId',
                        title: 'route.course.edit.lecture',
                        component: './Course/Edit/ArticleLecture'
                    },
                    {
                        path: '/course/:courseId/edit/landing',
                        title: 'route.course.edit.landing',
                        component: './Course/Edit/Landing'
                    },
                    {
                        path: '/course/:courseId/edit/price',
                        title: 'route.course.edit.price',
                        component: './Course/Edit/Price'
                    },
                    {
                        path: '/course/:courseId/edit/promotions',
                        title: 'route.course.edit.promotions',
                        component: './Course/Edit/Promotions'
                    },
                    {
                        path: '/course/:courseId/edit/messages',
                        title: 'route.course.edit.messages',
                        component: './Course/Edit/Messages'
                    },
                    {
                        component: '404'
                    }
                ]
            },
            {
                path: '/course/:courseId/manage',
                title: 'route.course.manage',
                component: '../layouts/CourseLayouts/ManageLayout',
                routes: [
                    {
                        path: '/course/:courseId/manage/forum',
                        title: 'route.course.manage.forum',
                        component: '../layouts/ForumLayout',
                        routes: [
                            {
                                path: '/course/:courseId/manage/forum',
                                component: './Course/Manage/Forum/index',
                                title: 'route.course.manage.forum.allthreads'
                            },
                            {
                                path: '/course/:courseId/manage/forum/thread/:threadId',
                                component: './Course/Manage/Forum/Thread',
                                title: 'route.course.manage.forum.thread'
                            },
                            {
                                component: '404'
                            }
                        ]
                    },
                    {
                        path: '/course/:courseId/manage/announcements',
                        title: 'route.course.manage.announcements',
                        component: './Course/Manage/Announcements'
                    },
                    {
                        path: '/course/:courseId/manage/reviews',
                        title: 'route.course.manage.reviews',
                        component: '../layouts/ReviewsLayout',
                        routes: [
                            {
                                path: '/course/:courseId/manage/reviews',
                                title: 'route.course.manage.reviews',
                                component: './Course/Manage/Reviews/index'
                            },
                            {
                                path: '/course/:courseId/manage/reviews/thread/:threadId',
                                title: 'route.course.manage.reviews',
                                component: './Course/Manage/Reviews/Thread'
                            },
                            {
                                component: '404'
                            }
                        ]
                    },
                    {
                        path: '/course/:courseId/manage/messenger',
                        title: 'route.course.manage.messenger',
                        componenet: './Course/Manage/Messenger'
                    },
                    {
                        path: '/course/:courseId/manage/settings',
                        title: 'route.course.manage.settings',
                        component: './Course/Manage/Settings'
                    },
                    {
                        component: '404'
                    }
                ]
            },
            {
                redirect: '/error/404'
            }
        ]
    },
    {
        path: '/', component: '../layouts/BasicLayout',
        Routes: ['./src/routes/Authenticated'],
        routes: [
            {
                path: '/courses',
                title: 'route.basic.courses',
                component: './Courses'
            },
            {
                path: '/communications',
                title: 'route.basic.communications',
                routes: [
                    {
                        path: '/communications/notifications',
                        title: 'route.basic.communications.notifications',
                        component: './Communications/Notifications'
                    },
                    {
                        path: '/communications/messages',
                        title: 'route.basic.communications.messages',
                        component: './Communications/Messages'
                    },
                    {
                        path: '/communications/followers',
                        title: 'route.basic.communications.followers',
                        component: './Communications/Followers'
                    },
                    {
                        path: '/communications/announcements',
                        title: 'route.basic.communications.announcements',
                        component: './Communications/Announcements'
                    },
                    {
                        redirect: '/error/404'
                    }
                ]
            },
            {
                path: '/performance',
                title: 'route.basic.performance',
                routes: [
                    {
                        path: '/performance/overview',
                        title: 'route.basic.performance.overview',
                        component: './Performance/Overview'
                    },
                    {
                        path: '/performance/reviews',
                        title: 'route.basic.performance.reviews',
                        component: './Performance/Reviews'
                    },
                    {
                        path: '/performance/students',
                        title: 'route.basic.performance.students',
                        component: './Performance/Students'
                    },
                    {
                        redirect: '/error/404'
                    }
                ]
            },
            {
                path: '/tools',
                title: 'route.basic.tools',
                component: './Tools'
            },
            {
                path: '/help',
                title: 'route.basic.help',
                component: './Help'
            },
            {
                path: '/exception',
                routes: [
                    {
                        path: '/exception/404',
                        title: 'route.exception.404',
                        component: './Exception/404'
                    },
                    {
                        path: '/exception/403',
                        title: 'route.exception.403',
                        component: './Exception/403'
                    },
                    {
                        path: '/exception/500',
                        title: 'route.exception.500',
                        component: './Exception/500'
                    },
                    {
                        redirect: '/exception/404'
                    }
                ]
            },
            {
                path: '/settings',
                title: 'route.basic.settings',
                component: './Settings'
            },
            {
                path: '/',
                redirect: '/courses'
            },
            {
                redirect: '/exception/404'
            }
        ]
    }
]