import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar, AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill, BsBoxArrowUpRight} from 'react-icons/bs'

import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {id} = match.params

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)

    if (response.ok) {
      const data = await response.json()

      const job = data.job_details

      const updatedJob = {
        id: job.id,
        title: job.title,
        companyLogoUrl: job.company_logo_url,
        companyWebsiteUrl: job.company_website_url,
        employmentType: job.employment_type,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        skills: job.skills,
        lifeAtCompany: job.life_at_company,
      }

      const updatedSimilarJobs = data.similar_jobs.map(each => ({
        id: each.id,
        title: each.title,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        location: each.location,
        rating: each.rating,
        jobDescription: each.job_description,
      }))

      this.setState({
        jobDetails: updatedJob,
        similarJobs: updatedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />

      <h1>Oops! Something Went Wrong</h1>

      <p>We cannot seem to find the page you are looking for</p>

      <button type="button" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {jobDetails, similarJobs} = this.state

    return (
      <div className="job-details-container">
        <div className="job-card">
          <div className="company-section">
            <img
              src={jobDetails.companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />

            <div>
              <h1>{jobDetails.title}</h1>

              <div className="rating-container">
                <AiFillStar className="star-icon" />
                <p>{jobDetails.rating}</p>
              </div>
            </div>
          </div>

          <div className="location-package-container">
            <div className="location-job-container">
              <div className="icon-text">
                <AiFillHome />
                <p>{jobDetails.location}</p>
              </div>

              <div className="icon-text">
                <BsBriefcaseFill />
                <p>{jobDetails.employmentType}</p>
              </div>
            </div>

            <p>{jobDetails.packagePerAnnum}</p>
          </div>

          <hr />

          <div className="description-visit">
            <h1>Description</h1>

            <a
              href={jobDetails.companyWebsiteUrl}
              target="_blank"
              rel="noreferrer"
            >
              Visit <BsBoxArrowUpRight />
            </a>
          </div>

          <p>{jobDetails.jobDescription}</p>

          <h1>Skills</h1>

          <ul className="skills-list">
            {jobDetails.skills?.map(skill => (
              <li key={skill.name}>
                <img
                  src={skill.image_url}
                  alt={skill.name}
                  className="skill-image"
                />
                <p>{skill.name}</p>
              </li>
            ))}
          </ul>

          <h1>Life at Company</h1>

          <div className="life-company">
            <p>{jobDetails.lifeAtCompany?.description}</p>

            <img
              src={jobDetails.lifeAtCompany?.image_url}
              alt="life at company"
              className="life-image"
            />
          </div>
        </div>

        <h1 className="similar-heading">Similar Jobs</h1>

        <ul className="similar-jobs-list">
          {similarJobs.map(each => (
            <SimilarJobItem key={each.id} jobDetails={each} />
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state

    let view

    switch (apiStatus) {
      case apiStatusConstants.success:
        view = this.renderSuccessView()
        break
      case apiStatusConstants.failure:
        view = this.renderFailureView()
        break
      case apiStatusConstants.inProgress:
        view = this.renderLoader()
        break
      default:
        view = null
    }

    return (
      <>
        <Header />
        <div className="job-details-bg">{view}</div>
      </>
    )
  }
}

export default JobItemDetails
