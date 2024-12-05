import LoggedInNav from '@/components/Nav/LoggedInNav'
import { useEffect, useState, Fragment } from 'react'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react'
import dynamic from 'next/dynamic'
import { useStore } from '@/store/use-store'
import { toJS } from 'mobx'
import axios from 'axios'
import Link from 'next/link'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Field, Label, Description, Switch, Dialog, Transition } from '@headlessui/react'


function Dashboard() {
  const router = useRouter()
  const store = useStore()
  const { global: { user, projects, project, token, update, _alert, } } = store
  const [usageData, setUsageData] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  useEffect(() => {
    if (!token || !user?.email) return;

    const fetchProjects = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        data?.projects && update('projects', data.projects)
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }

    fetchProjects()
  }, [token, user])

  const handleActiveToggle = async (projectId, newState) => {
    console.log('toggle');

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/project/${projectId}`,
        { active: newState },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      console.log("data:", data)
      if (data?.success) {
        update('projects', projects.map(p =>
          p.id === projectId ? { ...p, active: newState } : p
        ))
        _alert('Project status updated successfully', 'success')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      _alert('Failed to update project status', 'error')
    }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/project`,
        { name: newProjectName },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data?.project) {
        update('projects', [...projects, data.project])
        _alert('Project created successfully', 'success')
        setIsOpen(false)
        setNewProjectName('')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      _alert('Failed to create project', 'error')
    }
  }

  return (
    <LoggedInNav name="Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:tracking-tight">
              Your Projects
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Manage and monitor all your projects in one place
            </p>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center rounded-md bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
              New Project
            </button>

            <Transition.Root show={isOpen} as={Fragment}>
              <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                  <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      enterTo="opacity-100 translate-y-0 sm:scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                      leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                      <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                        <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="sr-only">Close</span>
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </div>
                        <div className="sm:flex sm:items-start">
                          <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                            <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                              Create New Project
                            </Dialog.Title>
                            <form onSubmit={handleCreateProject} className="mt-6">
                              <div>
                                <label htmlFor="project-name" className="block text-sm font-medium leading-6 text-gray-900">
                                  Project Name
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="project-name"
                                    id="project-name"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>
                              <div className="mt-6">
                                <button
                                  type="submit"
                                  className="inline-flex justify-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                                >
                                  Create
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>
          </div>
        </div>

        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <li key={project.id} className="col-span-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
              <Link href={`/project/${project.id}`} className="block h-full">
                <div className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <svg className="h-6 w-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                  </div>
                  <p className="mt-3 text-sm text-gray-500">{project.description}</p>
                  <div className="mt-6">
                    <Field className="flex items-center justify-between">
                      <span className="flex grow flex-col">
                        {/* <Label as="span" passive className="text-sm/6 font-medium text-gray-900">
                          Publishing Status
                        </Label> */}
                        <Description as="span" className="text-sm text-gray-500">
                          {project.active
                            ? "Project is active and will publish new content"
                            : "Project is paused and won't publish new content"}
                        </Description>
                      </span>
                      <div onClick={(e) => e.preventDefault()}>
                        <Switch
                          checked={project.active}
                          onChange={(newState) => handleActiveToggle(project.id, newState)}
                          className={`${project.active ? 'bg-rose-600' : 'bg-gray-200'
                            } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2`}
                        >
                          <span className="sr-only">
                            {project.active ? 'Deactivate project' : 'Activate project'}
                          </span>
                          <span
                            aria-hidden="true"
                            className={`${project.active ? 'translate-x-5' : 'translate-x-0'
                              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </div>
                    </Field>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </LoggedInNav>
  )
}
export default observer(Dashboard)