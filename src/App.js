import './App.css';
import { useState } from 'react';
import { Button, Container, Form, Navbar, Tab, Tabs, Table, Image, Modal } from 'react-bootstrap';
import logo from './components/img/logo.jfif';

function App() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [repos, setRepos] = useState([]);
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState('');

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const searchProfile = async () => {
    setLoading(true);
    const data = await fetchData(`https://api.github.com/search/users?q=${username}`);
    if (data?.items.length > 0) {
      const profileData = data.items[0];
      setProfile(profileData);
      getFollowers(profileData.followers_url);
      getFollowing(profileData.url + '/following');
      getRepos(profileData.repos_url);
    }
    setLoading(false);
  };

  const getFollowers = async (url) => {
    const data = await fetchData(url);
    setFollowers(data || []);
  };

  const getFollowing = async (url) => {
    const data = await fetchData(url);
    setFollowing(data || []);
  };

  const getRepos = async (url) => {
    const data = await fetchData(url);
    setRepos(Array.isArray(data) ? data : []);
  };

  const getCommits = async (repoName) => {
    setLoading(true);
    const data = await fetchData(`https://api.github.com/repos/${profile.login}/${repoName}/commits`);
    setCommits(data || []);
    setSelectedRepo(repoName);
    setShowModal(true);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchProfile();
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="https://codingblocks.com/" target='_blank'>
            <Image src={logo} width="80" height="80" className="d-inline-block align-top" alt="Coding Blocks" />
            <span className="navbar-text" style={{ fontSize: '2rem' }}>Github Search</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Form className="ml-auto d-flex align-items-center mt-3 mt-lg-0" onSubmit={handleSubmit} style={{ marginLeft: 'auto' }}>
              <Form.Control
                type="text"
                placeholder="Enter Github Username"
                className="mr-2"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                style={{ maxWidth: '250px', width: '100%', marginRight: '10px', marginTop: '10px' }}
              />
              <Button variant="outline-light" type="submit" disabled={loading} style= {{marginRight: '20px', marginTop: '10px'}}>
                {loading ? 'Searching' : 'Search'}
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {profile && (
        <Container>
          <div style={{ marginTop: 30 }}>
            <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 20 }}>
              <Image src={profile.avatar_url} roundedCircle width="80" height="80" alt={profile.login} style={{ marginRight: '10px' }} />
              <h3 style={{ fontFamily: 'cursive', marginTop: 20, color: 'white' }}>{profile.login}</h3>
            </div>

            <Tabs
              id="controlled-tab"
              activeKey={selectedIndex}
              onSelect={(k) => setSelectedIndex(parseInt(k, 10))}
              className="mb-3"
              fill
            >
              <Tab eventKey={0} title="Followers">
                <Table striped bordered hover variant="dark">
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>User Name</th>
                      <th>Profile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {followers.map((follower) => (
                      <tr key={follower.id}>
                        <td>
                          <Image src={follower.avatar_url} roundedCircle width="40" height="40" alt={follower.login} />
                        </td>
                        <td>{follower.login}</td>
                        <td>
                          <Button variant="outline-light" onClick={() => window.open(`https://github.com/${follower.login}`, '_blank', 'noopener,noreferrer')}>
                            Visit Profile
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>

              <Tab eventKey={1} title="Following">
                <Table striped bordered hover variant="dark">
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>User Name</th>
                      <th>Profile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {following.map((follow) => (
                      <tr key={follow.id}>
                        <td>
                          <Image src={follow.avatar_url} roundedCircle width="40" height="40" alt={follow.login} />
                        </td>
                        <td>{follow.login}</td>
                        <td>
                          <Button variant="outline-light" onClick={() => window.open(`https://github.com/${follow.login}`, '_blank', 'noopener,noreferrer')}>
                            Visit Profile
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>

              <Tab eventKey={2} title="Repositories">
                <Table striped bordered hover variant="dark">
                  <thead>
                    <tr>
                      <th>Repository Name</th>
                      <th>Description</th>
                      <th>View Repository</th>
                      <th>Commits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repos.map((repo) => (
                      <tr key={repo.id}>
                        <td>{repo.name}</td>
                        <td>{repo.description || 'N/A'}</td>
                        <td>
                          <Button variant="outline-light" onClick={() => window.open(repo.html_url, '_blank', 'noopener,noreferrer')}>
                            View Repo
                          </Button>
                        </td>
                        <td>
                          <Button variant="outline-light" onClick={() => getCommits(repo.name)}>
                            View Commits
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>
            </Tabs>
          </div>
        </Container>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Commits for {selectedRepo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>SHA</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {commits.map((commit) => (
                  <tr key={commit.sha}>
                    <td>{commit.sha}</td>
                    <td>{commit.commit.message}</td>
                    <td>{new Date(commit.commit.author.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
