import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Profile extends Component {
  state = {
    profileData: {},
    apiStatus: apiStatusConstants.inProgress,
  }

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(
      'https://apis.ccbp.in/profile',
      options,
    )

    if (response.ok) {
      const data = await response.json()

      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl:
          data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSuccessView = () => {
    const {profileData} = this.state

    return (
      <div className="profile-card">
        <img
          src={profileData.profileImageUrl}
          alt="profile"
          className="profile-image"
        />

        <h1 className="profile-name">
          {profileData.name}
        </h1>

        <p className="profile-bio">
          {profileData.shortBio}
        </p>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="profile-failure">
      <button
        type="button"
        onClick={this.getProfile}
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader">
      <Loader
        type="ThreeDots"
        color="#ffffff"
        height="50"
        width="50"
      />
    </div>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      case apiStatusConstants.inProgress:
        return this.renderLoader()

      default:
        return null
    }
  }
}

export default Profile