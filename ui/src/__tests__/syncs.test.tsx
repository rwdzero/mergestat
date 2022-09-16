
import { MockedProvider } from '@apollo/react-testing'
import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import 'intersection-observer'
import { useRouter } from 'next/router'
import RepoDetailsPage from 'src/pages/repos/[repository]'
import { RepositoriesProvider } from 'src/state/contexts'
import { TEST_IDS } from 'src/utils/constants'
import { DynamicValues } from 'src/__mocks__/constants.mock'
import { apolloMockReposWithData } from 'src/__mocks__/repos.mock'
import { apolloMockAddSyncType, apolloMockNextSyncNow, apolloMockRemoveRepo, apolloMockSyncNow, apolloMockSyncsTypesData, apolloMockSyncsTypesRunningData } from 'src/__mocks__/syncs.mock'

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn()
}))

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

describe('GraphQL queries: (Syncs Types)', () => {
  it('calling useMutation(): sync now', async () => {
    const mockRouter = { query: { repository: DynamicValues.repoId } };
    (useRouter as jest.Mock).mockReturnValue(mockRouter)

    render(
      <MockedProvider mocks={[apolloMockSyncsTypesData, apolloMockSyncNow, apolloMockSyncsTypesRunningData]} addTypename={false}>
        <RepositoriesProvider>
          <RepoDetailsPage />
        </RepositoriesProvider>
      </MockedProvider>
    )

    // Checks syncs types table has 10 rows
    await waitFor(() => {
      const rows = screen.getAllByTestId(TEST_IDS.syncsTypesRow)
      expect(rows.length).toBe(10)
    })

    // Get 'Sync Now' button
    const buttons = screen.getAllByTestId(TEST_IDS.syncsTypesSyncNowButton)
    fireEvent.click(buttons[2] as HTMLButtonElement)

    // Checks if 'Git Files' is syncing
    await waitFor(() => {
      const element = screen.getByText('Syncing...')
      expect(element as HTMLSpanElement).toBeInTheDocument()
    })
  })

  it('calling useMutation(): first time hitting sync now', async () => {
    const mockRouter = { query: { repository: DynamicValues.repoId } };
    (useRouter as jest.Mock).mockReturnValue(mockRouter)

    render(
      <MockedProvider mocks={[apolloMockSyncsTypesData, apolloMockAddSyncType, apolloMockNextSyncNow, apolloMockSyncsTypesRunningData]} addTypename={false}>
        <RepositoriesProvider>
          <RepoDetailsPage />
        </RepositoriesProvider>
      </MockedProvider>
    )

    // Checks syncs types table has 10 rows
    await waitFor(() => {
      const rows = screen.getAllByTestId(TEST_IDS.syncsTypesRow)
      expect(rows.length).toBe(10)
    })

    // Get 'Sync Now' button
    const buttons = screen.getAllByTestId(TEST_IDS.syncsTypesSyncNowButton)
    fireEvent.click(buttons[0] as HTMLButtonElement)

    // Checks if 'Git Files' is syncing
    await waitFor(() => {
      const element = screen.getByText('Syncing...')
      expect(element as HTMLSpanElement).toBeInTheDocument()
    })
  })

  it('calling useMutation(): remove repo', async () => {
    const mockRouter = { push: jest.fn(), query: { repository: DynamicValues.repoId } };
    (useRouter as jest.Mock).mockReturnValue(mockRouter)

    render(
      <MockedProvider mocks={[apolloMockSyncsTypesData, apolloMockReposWithData, apolloMockRemoveRepo]} addTypename={false}>
        <RepositoriesProvider>
          <RepoDetailsPage />
        </RepositoriesProvider>
      </MockedProvider>
    )

    // Click on 'Repo Settings'
    let settingsTab
    await waitFor(() => {
      settingsTab = screen.getByTestId(TEST_IDS.removeRepoSettingsTab)
      expect(settingsTab as HTMLButtonElement).toBeInTheDocument()
    })
    settingsTab && fireEvent.click(settingsTab)

    // Checks if 'Remove Repository' button is rendered
    let removeButton
    await waitFor(() => {
      removeButton = screen.getByTestId(TEST_IDS.removeRepoButton)
      expect(removeButton as HTMLButtonElement).toBeInTheDocument()
    })
    removeButton && fireEvent.click(removeButton)

    // Checks warning banner is not rendered
    await waitFor(() => {
      const text = screen.queryByText(/This repo was added by an automatic import/i)
      expect(text).toBeNull()
    })

    // Checks if 'Remove Repository' button from Modal is rendered
    let removeButtonModal
    await waitFor(() => {
      removeButtonModal = screen.getByTestId(TEST_IDS.removeRepoButtonModal)
      expect(removeButtonModal as HTMLButtonElement).toBeInTheDocument()
    })
    removeButtonModal && fireEvent.click(removeButtonModal)

    // Checks if repository was removed
    await waitFor(() => {
      const element = screen.getByText('Repository removed successfully')
      expect(element as HTMLSpanElement).toBeInTheDocument()
    })

    // Checks was redirected to /repos page
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/repos')
    })
  })
})