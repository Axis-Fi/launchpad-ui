type RapidTwitterApiResponse = {
  data: {
    user: {
      timeline_response: {
        timeline: {
          instructions: {
            __typename: string;
            entries?: {
              content: {
                content: {
                  userResult: {
                    result: {
                      legacy: {
                        screen_name: string;
                      };
                      rest_id: string;
                    };
                  };
                };
              };
            }[];
          }[];
        };
      };
    };
  };
};

export type { RapidTwitterApiResponse };
