'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { keyframes } from '@mui/system'

import Logo from '@/@core/svg/Logo'

const diamondSparkle = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 0.8; }
  100% { opacity: 0.3; }
`

// Pre-calculate diamond positions to avoid hydration mismatch
const diamondPositions = [...Array(12)].map(() => ({
  top: `${Math.floor(Math.random() * 100)}%`,
  left: `${Math.floor(Math.random() * 100)}%`
}))

const HomeContent = () => {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 100px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {diamondPositions.map((position, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            width: { xs: '30px', md: '50px' },
            height: { xs: '30px', md: '50px' },
            opacity: 0.1,
            background: 'linear-gradient(45deg, #B8860B, #DAA520)',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            animation: `${diamondSparkle} ${2 + index / 2}s infinite ease-in-out`,
            top: position.top,
            left: position.left,
            zIndex: 1
          }}
        />
      ))}

      <Card
        elevation={0}
        sx={{
          maxWidth: 1200,
          width: '90%',
          background: 'transparent',
          textAlign: 'center',
          py: 8,
          position: 'relative',
          zIndex: 2
        }}
      >
        <CardContent>
          {/* Rotating Diamond Logo */}
          <Logo width={220} />

          <Typography
            variant='h1'
            sx={{
              fontSize: { xs: '2.5rem', md: '4.5rem' },
              fontWeight: 800,
              color: '#1A1A1A',
              mb: 3,
              textTransform: 'uppercase',
              letterSpacing: '6px'
            }}
          >
            Rising Lab Diamonds
          </Typography>

          <Typography
            variant='h5'
            sx={{
              color: '#666',
              fontWeight: 400,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 2,
              fontSize: { xs: '1.2rem', md: '1.6rem' },
              mb: 6
            }}
          >
            Crafting Brilliance, Engineering Perfection
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 3,
              flexWrap: 'wrap'
            }}
          >
            {['Sustainable', 'Ethical', 'Innovative', 'Luxurious'].map((text, index) => (
              <Typography
                key={index}
                sx={{
                  color: '#B8860B',
                  fontSize: '1rem',
                  border: '1px solid #DAA520',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '20px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #B8860B, #DAA520)',
                    color: '#fff',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {text}
              </Typography>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default HomeContent
