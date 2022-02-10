/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getResult = /* GraphQL */ `
  query GetResult($name: String!, $value: String!) {
    getResult(name: $name, value: $value) {
      name
    }
  }
`;
export const getProfile = /* GraphQL */ `
  query GetProfile($name: String!, $value: String!) {
    getProfile(name: $name, value: $value) {
      search_name
      usage
      belong_to
      authored_by
      affiliated_with
      people
      made_by
    }
  }
`;
export const getGraphInfo = /* GraphQL */ `
  query GetGraphInfo($value: String!) {
    getGraphInfo(value: $value) {
      nodes {
        id
        label
      }
      links {
        source
        target
        value
      }
    }
  }
`;
