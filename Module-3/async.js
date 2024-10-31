// Quiet Times
async function activityTable(day) {
    // Initialize array of 24 hours with zeros
    let hours = new Array(24).fill(0);
    
    // Read the list of log files
    let logFileList = await textFile("camera_logs.txt");
    let logFiles = logFileList.trim().split("\n");
    
    // Process each log file
    for (let file of logFiles) {
      let content = await textFile(file);
      let timestamps = content.trim().split("\n");
      
      // Process each timestamp
      for (let timestamp of timestamps) {
        let date = new Date(Number(timestamp));
        // Check if this timestamp is from the requested day
        if (date.getDay() === day) {
          // Increment the count for this hour
          hours[date.getHours()]++;
        }
      }
    }
    
    return hours;
  }

// Real Promises
  function Promise_all(promises) {
    return new Promise((resolve, reject) => {
      // Handle empty array case
      if (promises.length === 0) {
        resolve([]);
        return;
      }
      
      // Create array to store results in correct order
      let results = new Array(promises.length);
      let pending = promises.length;
      
      // Process each promise at its index
      promises.forEach((promise, index) => {
        // Handle non-promise values
        Promise.resolve(promise)
          .then(value => {
            results[index] = value;
            pending--;
            // If this was the last promise, resolve with all results
            if (pending === 0) {
              resolve(results);
            }
          })
          .catch(reject); // Any rejection should reject the whole promise
      });
    });
  }

  // Building Promise.all
  function activityTable(day) {
    // Initialize array of 24 hours with zeros
    let hours = new Array(24).fill(0);
    
    return textFile("camera_logs.txt")
      .then(files => {
        // Split file list and map each filename to a promise that will
        // read and process that file
        return Promise.all(files.trim().split("\n").map(filename => {
          return textFile(filename).then(content => {
            // Process timestamps as soon as each file is available
            content.trim().split("\n").forEach(timestamp => {
              let date = new Date(Number(timestamp));
              if (date.getDay() === day) {
                hours[date.getHours()]++;
              }
            });
          });
        }));
      })
      .then(() => hours); // Return the completed hours array
  }
