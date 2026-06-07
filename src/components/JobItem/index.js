import {Link} from 'react-router-dom'

import {
  AiFillStar,
  AiFillHome,
} from 'react-icons/ai'

import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const JobItem = props => {
  const {jobDetails} = props

  const {
    id,
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
  } = jobDetails

  return (
    <Link
      to={`/jobs/${id}`}
      className="job-link"
    >
      <li className="job-card">
        <div className="company-section">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />

          <div>
            <h1 className="job-title">{title}</h1>

            <div className="rating-container">
              <AiFillStar className="star-icon" />
              <p>{rating}</p>
            </div>
          </div>
        </div>

        <div className="location-package-container">
          <div className="location-job-container">
            <div className="icon-text">
              <AiFillHome />
              <p>{location}</p>
            </div>

            <div className="icon-text">
              <BsBriefcaseFill />
              <p>{employmentType}</p>
            </div>
          </div>

          <p>{packagePerAnnum}</p>
        </div>

        <hr />

        <h1 className="description-heading">
          Description
        </h1>

        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem