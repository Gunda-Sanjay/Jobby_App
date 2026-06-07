import {AiFillStar, AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJobItem = props => {
  const {jobDetails} = props

  return (
    <li className="similar-job-card">
      <div className="company-section">
        <img
          src={jobDetails.companyLogoUrl}
          alt="similar job company logo"
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

      <h1>Description</h1>

      <p>{jobDetails.jobDescription}</p>

      <div className="icon-text">
        <AiFillHome />
        <p>{jobDetails.location}</p>
      </div>

      <div className="icon-text">
        <BsBriefcaseFill />
        <p>{jobDetails.employmentType}</p>
      </div>
    </li>
  )
}

export default SimilarJobItem