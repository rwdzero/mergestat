import { MutationFunctionOptions } from '@apollo/client'
import { Button, Input, Label } from '@mergestat/blocks'
import React, { ChangeEvent, PropsWithChildren } from 'react'
import { ExploreUiMutation } from 'src/api-logic/graphql/generated/schema'
import { ExploreParams, useRepoExploreContext, useRepoExploreSetState } from 'src/state/contexts/repo-explore.context'
import Filter from './filter'

type FiltersSectionProps = PropsWithChildren<{
  explore: (options?: MutationFunctionOptions<ExploreUiMutation> | undefined) => void
}>

const FiltersSection: React.FC<FiltersSectionProps> = ({ explore }: FiltersSectionProps) => {
  const [{
    params,
    params: {
      repo_pattern: filterRepo,
      file_contents_pattern: filterFile,
      author_name_pattern: filterAuthor,
      days_since_repo_modified_last: filterRepoDays,
      days_since_repo_not_modified_last: filterNotRepoDays,
      days_since_file_modified_last: filterFileDays,
      days_since_file_not_modified_last: filterNotFileDays
    }
  }] = useRepoExploreContext()
  const { setParams } = useRepoExploreSetState()

  const setParamsAndExplore = (params: ExploreParams) => {
    setParams(params)
    explore({ variables: { params } })
  }

  const clearFilters = () => {
    setParamsAndExplore({
      ...params,
      repo_pattern: undefined,
      file_contents_pattern: undefined,
      author_name_pattern: undefined,
      days_since_repo_modified_last: undefined,
      days_since_repo_not_modified_last: undefined,
      days_since_file_modified_last: undefined,
      days_since_file_not_modified_last: undefined
    })
  }

  const filter = (filter: keyof ExploreParams, value: string | undefined) => {
    setParamsAndExplore({
      ...params,
      [filter]: value,
    })
  }

  const onChangeParam = (filter: keyof ExploreParams, value: string | undefined) => {
    setParams({
      ...params,
      [filter]: value,
    })
  }

  const handleDaysChange = (filter: keyof ExploreParams, value: string | undefined) => {
    const regex = /^[0-9\b]+$/
    if (value && value.length <= 3 && (value === '' || regex.test(value))) {
      onChangeParam(filter, value)
    }
  }

  return (
    <div className='flex flex-wrap items-center'>
      <Filter
        label='Repo'
        value={filterRepo}
        reset={() => filter('repo_pattern', undefined)}
        explore={() => filter('repo_pattern', filterRepo)}
      >
        <Label>Matches pattern</Label>
        <Input value={filterRepo || ''} placeholder="mergestat/mergestat%"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeParam('repo_pattern', e.target.value)}
        />
      </Filter>

      <Filter
        label='File contents'
        value={filterFile}
        reset={() => filter('file_contents_pattern', undefined)}
        explore={() => filter('file_contents_pattern', filterFile)}
      >
        <Label>Matches pattern</Label>
        <Input value={filterFile || ''} placeholder="example%"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeParam('file_contents_pattern', e.target.value)}
        />
      </Filter>

      <Filter
        label='Author'
        value={filterAuthor}
        reset={() => filter('author_name_pattern', undefined)}
        explore={() => filter('author_name_pattern', filterAuthor)}
      >
        <Label>Matches pattern</Label>
        <Input value={filterAuthor || ''} placeholder="author-name%"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeParam('author_name_pattern', e.target.value)}
        />
      </Filter>

      <Filter
        label='Repo modified last'
        value={filterRepoDays ? `${filterRepoDays}d` : undefined}
        reset={() => filter('days_since_repo_modified_last', undefined)}
        explore={() => filter('days_since_repo_modified_last', filterRepoDays)}
      >
        <Label>Is in the last</Label>
        <div className='flex space-x-4'>
          <Input
            value={filterRepoDays || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleDaysChange('days_since_repo_modified_last', e.target.value)}
          />
          <Label>Days</Label>
        </div>
      </Filter>

      <Filter
        label='Repo not modified last'
        value={filterNotRepoDays ? `${filterNotRepoDays}d` : undefined}
        reset={() => filter('days_since_repo_not_modified_last', undefined)}
        explore={() => filter('days_since_repo_not_modified_last', filterNotRepoDays)}
      >
        <Label>Is not in the last</Label>
        <div className='flex space-x-4'>
          <Input
            value={filterNotRepoDays || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleDaysChange('days_since_repo_not_modified_last', e.target.value)}
          />
          <Label>Days</Label>
        </div>
      </Filter>

      <Filter
        label='File modified last'
        value={filterFileDays ? `${filterFileDays}d` : undefined}
        reset={() => filter('days_since_file_modified_last', undefined)}
        explore={() => filter('days_since_file_modified_last', filterFileDays)}
      >
        <Label>Is in the last</Label>
        <div className='flex space-x-4'>
          <Input
            value={filterFileDays || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleDaysChange('days_since_file_modified_last', e.target.value)}
          />
          <Label>Days</Label>
        </div>
      </Filter>

      <Filter
        label='File not modified last'
        value={filterNotFileDays ? `${filterNotFileDays}d` : undefined}
        reset={() => filter('days_since_file_not_modified_last', undefined)}
        explore={() => filter('days_since_file_not_modified_last', filterNotFileDays)}
      >
        <Label>Is not in the last</Label>
        <div className='flex space-x-4'>
          <Input
            value={filterNotFileDays || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleDaysChange('days_since_file_not_modified_last', e.target.value)}
          />
          <Label>Days</Label>
        </div>
      </Filter>

      <Button
        style={{ minHeight: '2.2rem' }}
        className='ml-2 text-thin my-1 p-0 h-2'
        label="Clear filters"
        skin="borderless"
        size='small'
        onClick={clearFilters}
      />
    </div>
  )
}

export default FiltersSection