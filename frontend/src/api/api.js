import axios from 'axios'

const BASE_URL = 'https://careerlens-backend-p6dc.onrender.com'

export const getColleges = () => axios.get(`${BASE_URL}/colleges/`)
export const getCollegeStats = (id) => axios.get(`${BASE_URL}/colleges/${id}/stats`)
export const getCompanies = () => axios.get(`${BASE_URL}/companies/`)
export const getCompany = (id) => axios.get(`${BASE_URL}/companies/${id}`)
export const getCompanyAlumni = (id) => axios.get(`${BASE_URL}/companies/${id}/alumni`)
export const getCompanyRoadmap = (id) => axios.get(`${BASE_URL}/companies/${id}/roadmap`)
export const compareCompanies = (ids) => axios.post(`${BASE_URL}/compare/`, { company_ids: ids })
export const compareColleges = (ids) => axios.post(`${BASE_URL}/colleges/compare`, { college_ids: ids })
export const getFeed = () => axios.get(`${BASE_URL}/feed/`)
export const predictPlacement = (data) => axios.post(`${BASE_URL}/predictor/`, data)
export const generatePrepPlan = (data) => axios.post(`${BASE_URL}/predictor/prep-plan`, data)
export const checkResume = (data) => axios.post(`${BASE_URL}/resume/check`, data)
export const registerUser = (data) => axios.post(`${BASE_URL}/auth/register`, data)
export const loginUser = (data) => axios.post(`${BASE_URL}/auth/login`, data, {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})