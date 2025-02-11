'use client'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

const AboutPage = () => {
  const stats = [
    { number: '10+', label: 'Years Experience' },
    { number: '1000+', label: 'Lab Diamonds Created' },
    { number: '100%', label: 'Customer Satisfaction' },
    { number: '50+', label: 'Expert Craftsmen' }
  ]

  const values = [
    {
      title: 'Innovation',
      description: 'Pioneering advanced technology in lab-grown diamond creation'
    },
    {
      title: 'Sustainability',
      description: 'Committed to eco-friendly practices and ethical diamond production'
    },
    {
      title: 'Quality',
      description: 'Rigorous quality control ensuring premium grade diamonds'
    },
    {
      title: 'Transparency',
      description: 'Complete clarity in our processes and pricing'
    }
  ]

  return (
    <Box sx={{ p: 6, maxWidth: 1400, margin: '0 auto' }}>
      {/* Hero Section */}
      <Typography
        variant='h1'
        sx={{
          fontSize: { xs: '2.5rem', md: '3.5rem' },
          fontWeight: 700,
          mb: 3,
          textAlign: 'center'
        }}
      >
        About Rising Lab Diamonds
      </Typography>

      {/* Mission Statement */}
      <Card sx={{ mb: 8, backgroundColor: 'primary.light', boxShadow: 3 }}>
        <CardContent sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant='h4' sx={{ mb: 3, color: 'primary.main' }}>
            Our Mission
          </Typography>
          <Typography variant='body1' sx={{ fontSize: '1.2rem', maxWidth: 800, mx: 'auto' }}>
            To revolutionize the diamond industry through sustainable practices, cutting-edge technology, and unwavering
            commitment to quality, making exceptional lab-grown diamonds accessible to all.
          </Typography>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', textAlign: 'center', boxShadow: 2 }}>
              <CardContent>
                <Typography variant='h3' sx={{ color: 'primary.main', mb: 1 }}>
                  {stat.number}
                </Typography>
                <Typography variant='body1' sx={{ color: 'text.secondary' }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Company Values */}
      <Typography variant='h4' sx={{ mb: 4, textAlign: 'center' }}>
        Our Values
      </Typography>
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {values.map((value, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', boxShadow: 2 }}>
              <CardContent>
                <Typography variant='h6' sx={{ mb: 2, color: 'primary.main' }}>
                  {value.title}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {value.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Story Section */}
      <Card sx={{ mb: 8, boxShadow: 3 }}>
        <CardContent sx={{ p: 6 }}>
          <Typography variant='h4' sx={{ mb: 4 }}>
            Our Story
          </Typography>
          <Typography variant='body1' sx={{ mb: 3 }}>
            Founded with a vision to transform the diamond industry, Rising Lab Diamonds began its journey as a pioneer
            in lab-grown diamond technology. Our state-of-the-art facility combines cutting-edge science with
            traditional diamond craftsmanship.
          </Typography>
          <Typography variant='body1'>
            Today, we stand at the forefront of sustainable luxury, creating diamonds that are not only beautiful but
            also environmentally conscious. Our commitment to innovation and excellence has made us a trusted name in
            the industry.
          </Typography>
        </CardContent>
      </Card>

      {/* Certification Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant='h4' sx={{ mb: 3 }}>
          Certifications & Standards
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography variant='body1' color='text.secondary'>
          All our diamonds are certified by leading international laboratories and meet the highest quality standards in
          the industry.
        </Typography>
      </Box>
    </Box>
  )
}

export default AboutPage
