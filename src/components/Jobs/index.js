import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import JobItem from '../JobItem'
import Profile from '../Profile'

import {employmentTypesList, salaryRangesList} from '../../App'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    searchInput: '',
    activeEmploymentTypes: [],
    activeSalaryRange: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {searchInput, activeEmploymentTypes, activeSalaryRange} = this.state

    const jwtToken = Cookies.get('jwt_token')

    const employmentType = activeEmploymentTypes.join(',')

    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${activeSalaryRange}&search=${searchInput}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      const updatedJobs = data.jobs.map(eachJob => ({
        id: eachJob.id,
        title: eachJob.title,
        rating: eachJob.rating,
        companyLogoUrl: eachJob.company_logo_url,
        location: eachJob.location,
        employmentType: eachJob.employment_type,
        packagePerAnnum: eachJob.package_per_annum,
        jobDescription: eachJob.job_description,
      }))

      this.setState({
        jobsList: updatedJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.getJobs()
  }

  onChangeEmploymentType = event => {
    const {activeEmploymentTypes} = this.state

    if (event.target.checked) {
      this.setState(
        {
          activeEmploymentTypes: [...activeEmploymentTypes, event.target.id],
        },
        this.getJobs,
      )
    } else {
      this.setState(
        {
          activeEmploymentTypes: activeEmploymentTypes.filter(
            each => each !== event.target.id,
          ),
        },
        this.getJobs,
      )
    }
  }

  onChangeSalaryRange = event => {
    this.setState(
      {
        activeSalaryRange: event.target.id,
      },
      this.getJobs,
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobs = () => {
    const {jobsList} = this.state

    if (jobsList.length === 0) {
      return (
        <div className="no-jobs-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-image"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters</p>
        </div>
      )
    }

    return (
      <ul className="jobs-list">
        {jobsList.map(eachJob => (
          <JobItem key={eachJob.id} jobDetails={eachJob} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />

      <h1>Oops! Something Went Wrong</h1>

      <p>We cannot seem to find the page you are looking for</p>

      <button type="button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderJobsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobs()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      case apiStatusConstants.inProgress:
        return this.renderLoader()

      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />

        <div className="jobs-container">
          <div className="filters-section">
            <Profile />

            <hr />

            <h1>Type of Employment</h1>

            <ul>
              {employmentTypesList.map(each => (
                <li key={each.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={each.employmentTypeId}
                    onChange={this.onChangeEmploymentType}
                  />
                  <label htmlFor={each.employmentTypeId}>{each.label}</label>
                </li>
              ))}
            </ul>

            <hr />

            <h1>Salary Range</h1>

            <ul>
              {salaryRangesList.map(each => (
                <li key={each.salaryRangeId}>
                  <input
                    type="radio"
                    name="salary"
                    id={each.salaryRangeId}
                    onChange={this.onChangeSalaryRange}
                  />
                  <label htmlFor={each.salaryRangeId}>{each.label}</label>
                </li>
              ))}
            </ul>
          </div>

          <div className="jobs-content">
            <div className="search-container">
              <input
                type="search"
                value={searchInput}
                onChange={this.changeSearchInput}
                placeholder="Search"
              />

              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearch}
              >
                <BsSearch />
              </button>
            </div>

            {this.renderJobsView()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
